package com.taro.android

import android.os.Bundle
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import fi.iki.elonen.NanoHTTPD.SOCKET_READ_TIMEOUT
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

class TaroActivity : AppCompatActivity() {
    private lateinit var webView: WebView

    private lateinit var taroMiniServer: TaroMiniServer;

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_mini_program)
        // 启动服务器
        taroMiniServer = TaroMiniServer(this)
        taroMiniServer.start(SOCKET_READ_TIMEOUT, false)

        // 获取 WebView 实例
        webView = findViewById(R.id.webView)

        // 启用 JavaScript 支持（可选）
        webView.settings.javaScriptEnabled = true

        // 设置 WebView 客户端
        webView.webViewClient = WebViewClient()

//        webView.addJavascriptInterface(TaroJsObject(this), "taro")

        lifecycleScope.launch(Dispatchers.Main) {
            delay(200)
            // 加载网页
            webView.loadUrl("http://127.0.0.1:8080/index.html")
        }
    }

    override fun onBackPressed() {
        // 如果 WebView 可以导航到上一页，则返回上一页，否则退出活动
        if (webView.canGoBack()) {
            webView.goBack()
        } else {
            super.onBackPressed()
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        taroMiniServer.stop()
    }
}