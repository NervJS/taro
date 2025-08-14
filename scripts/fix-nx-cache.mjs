import { promises as fs } from 'fs'
import path from 'path'
import { execSync } from 'child_process'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const workspaceDataDir = path.join(__dirname, '..', '.nx', 'workspace-data')

main()

async function main() {
  await stopDaemon()
  try {
    // 检查 workspace-data 目录是否存在
    await fs.access(workspaceDataDir)
    console.log(`✓ 找到 workspace-data 目录: ${workspaceDataDir}`)
  } catch (error) {
    console.log(`✗ workspace-data 目录不存在: ${workspaceDataDir}`)
    console.log('跳过缓存操作')
    return
  }
  try {
    // 步骤 1: 将 workspaceDataDir 目录下 .db, .db-wal, .db-shm 结尾的文件重命名为 temp_db, temp_db-wal, temp_db-shm
    await backUp();

    // 步骤 2: 运行 jest-taro-helper:clean 以获取新的数据库文件名
    await createDb();

    // 步骤 3: 再次停止 Nx daemon
    await stopDaemon();

    // 步骤 4: 复制后缀为 .db 的文件的文件名
    const dbFileName = await getDbName();

    // 步骤 5: 删除后缀为 .db 的文件
    await rmDB(dbFileName);

    // 步骤 6: 恢复备份的数据库文件
    await restoreDB(dbFileName);

  } catch (error) {
    console.error('\n❌ 操作失败:', error.message)
  }
}

async function stopDaemon() {
  // 停止 Nx daemon 以释放数据库文件锁定
  console.log('\n 停止 Nx daemon 以释放文件锁定...')
  try {
    execSync('pnpm nx daemon --stop', {
      cwd: path.join(__dirname, '..'),
      stdio: 'inherit'
    })
    console.log('  ✓ Nx daemon 已停止')
  } catch (error) {
    console.log('  ! Nx daemon 可能已经停止或不存在')
  }
}

async function backUp() {
  console.log('\n1. 备份数据库文件...')
  const files = await fs.readdir(workspaceDataDir)
  const dbFiles = files.filter(file => /\.db.*$/.test(file))

  for (const dbFile of dbFiles) {
    const ext = dbFile.split('.').pop();

    const originalPath = path.join(workspaceDataDir, dbFile)
    const tempPath = path.join(workspaceDataDir, `temp_${ext}`)

    try {
      await fs.rename(originalPath, tempPath)
      console.log(`  ✓ 备份: ${dbFile} → temp_${ext}`)
    } catch (error) {
      console.log(`  ! 无法备份 ${dbFile}:`, error.message)
    }
  }
}

async function createDb() {
  console.log('\n2. 运行 pnpm nx run jest-taro-helper:clean...')
  try {
    execSync('pnpm nx run jest-taro-helper:clean', {
      cwd: path.join(__dirname, '..'),
      stdio: 'inherit'
    })
    console.log('  ✓ jest-taro-helper:clean 执行成功')
  } catch (error) {
    console.error('  ✗ jest-taro-helper:clean 执行失败:', error.message)
    throw error
  }
}

async function getDbName() {
  console.log('\n4. 获取 .db 文件名...')
  const currentFiles = await fs.readdir(workspaceDataDir)
  const currentDbFiles = currentFiles.filter(file => file.endsWith('.db'))

  let dbFileName = null
  if (currentDbFiles.length > 0) {
    dbFileName = currentDbFiles[0].replace('.db', '')
    console.log(`  ✓ 找到数据库文件名: ${dbFileName}`)
    return dbFileName
  } else {
    console.log('  ! 未找到 .db 文件')
    throw new Error('未找到数据库文件')
  }
}

async function rmDB(dbFileName) {
  console.log('\n5. 删除新据库文件...')
  const files = await fs.readdir(workspaceDataDir)
  const dbFiles = files.filter(file => file.startsWith(dbFileName))

  for (const dbFile of dbFiles) {
    const filePath = path.join(workspaceDataDir, dbFile)
    try {
      await fs.unlink(filePath)
      console.log(`  ✓ 删除: ${dbFile}`)
    } catch (error) {
      console.log(`  ! 无法删除 ${dbFile}:`, error.message)
    }
  }
}

async function restoreDB(dbFileName) {
  console.log('\n6. 恢复备份的数据库文件...')
  const finalFiles = await fs.readdir(workspaceDataDir)
  const tempFiles = finalFiles.filter(file => file.startsWith('temp_'))

  for (const tempFile of tempFiles) {
    const tempPath = path.join(workspaceDataDir, tempFile)
    const originalExtension = tempFile.replace('temp_', '.')
    const newFileName = `${dbFileName}${originalExtension}`
    const newPath = path.join(workspaceDataDir, newFileName)

    try {
      await fs.rename(tempPath, newPath)
      console.log(`  ✓ 恢复: ${tempFile} → ${newFileName}`)
    } catch (error) {
      console.log(`  ! 无法恢复 ${tempFile}:`, error.message)
    }
  }
}