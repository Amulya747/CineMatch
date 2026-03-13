package com.example.cinematch.data.remote

import com.example.cinematch.data.model.Movie
import retrofit2.http.Body
import retrofit2.http.POST
import retrofit2.http.GET

interface MovieApiService {
    // In a real Android app, you'd call a backend or Gemini directly via SDK
    // For this demo, we assume a proxy or direct Gemini integration
    @POST("recommendations")
    suspend fun getRecommendations(@Body request: RecommendationRequest): List<Movie>
}

data class RecommendationRequest(
    val prompt: String,
    val systemInstruction: String
)
