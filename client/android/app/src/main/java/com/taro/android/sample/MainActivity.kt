package com.taro.android.sample

import android.content.Intent
import android.os.Bundle
import android.widget.Button
import androidx.appcompat.app.AppCompatActivity
import com.taro.android.TaroActivity

class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        findViewById<Button>(R.id.open_miniprogram).setOnClickListener {
            startActivity(Intent(this@MainActivity, TaroActivity::class.java))
        }

    }
}