package com.taro.android

import android.content.Context
import fi.iki.elonen.NanoHTTPD
import java.io.IOException

/**
 * @author kongxiaojun
 * @date 2023/6/7
 * @description
 */
class TaroMiniServer(val context: Context) : NanoHTTPD(8080) {

    @Throws(IOException::class)
    override fun serve(session: NanoHTTPD.IHTTPSession): NanoHTTPD.Response {
        val uri = session.uri
        val filename = uri.substring(1) // Remove leading slash from URI
        try {
            val inputStream = context.assets.open("dist/${filename}")
            val mimeType = getMimeType(filename)
            return newChunkedResponse(Response.Status.OK, mimeType, inputStream)
        } catch (e: IOException) {
            return newFixedLengthResponse(Response.Status.NOT_FOUND, NanoHTTPD.MIME_PLAINTEXT, "File not found")
        }
    }

    private fun getMimeType(filename: String): String {
        // Map file extensions to MIME types
        return when {
            filename.endsWith(".html") -> "text/html"
            filename.endsWith(".css") -> "text/css"
            filename.endsWith(".js") -> "application/javascript"
            filename.endsWith(".map") -> "application/json"
            // Add more MIME types as needed
            else -> NanoHTTPD.MIME_PLAINTEXT
        }
    }

}