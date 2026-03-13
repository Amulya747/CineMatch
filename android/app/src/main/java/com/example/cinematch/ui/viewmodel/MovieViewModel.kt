package com.example.cinematch.ui.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.cinematch.data.model.Movie
import com.example.cinematch.data.model.HistoryEntity
import com.example.cinematch.data.repository.MovieRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch
import com.google.gson.Gson

class MovieViewModel(private val repository: MovieRepository) : ViewModel() {
    private val _movies = MutableStateFlow<List<Movie>>(emptyList())
    val movies: StateFlow<List<Movie>> = _movies

    private val _isLoading = MutableStateFlow(false)
    val isLoading: StateFlow<Boolean> = _isLoading

    val history = repository.getHistory()

    fun getRecommendations(type: String, query: String, prompt: String) {
        viewModelScope.launch {
            _isLoading.value = true
            try {
                val results = repository.fetchRecommendations(prompt)
                _movies.value = results
                
                // Save to history
                val historyItem = HistoryEntity(
                    type = type,
                    query = query,
                    resultsJson = Gson().toJson(results)
                )
                repository.saveHistory(historyItem)
            } catch (e: Exception) {
                // Handle error
            } finally {
                _isLoading.value = false
            }
        }
    }
}
