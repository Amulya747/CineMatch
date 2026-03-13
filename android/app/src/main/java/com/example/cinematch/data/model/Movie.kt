package com.example.cinematch.data.model

import androidx.room.Entity
import androidx.room.PrimaryKey

data class Movie(
    val title: String,
    val year: String,
    val genre: List<String>,
    val description: String,
    val rating: String,
    val language: String,
    val country: String,
    val streamingPlatforms: List<String> = emptyList(),
    val posterUrl: String? = null
)

@Entity(tableName = "history")
data class HistoryEntity(
    @PrimaryKey(autoGenerate = true) val id: Int = 0,
    val type: String,
    val query: String,
    val resultsJson: String,
    val timestamp: Long = System.currentTimeMillis()
)
