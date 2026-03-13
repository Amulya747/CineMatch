package com.example.cinematch

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.example.cinematch.ui.screens.*
import com.example.cinematch.ui.viewmodel.MovieViewModel
import com.example.cinematch.ui.theme.CineMatchTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        // In a real app, use Dependency Injection (Hilt) to provide the ViewModel
        // For this demo, we assume a factory or simple instantiation
        setContent {
            CineMatchTheme {
                val navController = rememberNavController()
                Scaffold(
                    bottomBar = {
                        NavigationBar {
                            // Navigation items here
                        }
                    }
                ) { innerPadding ->
                    NavHost(
                        navController = navController,
                        startDestination = "dashboard",
                        modifier = Modifier.padding(innerPadding)
                    ) {
                        composable("dashboard") { /* DashboardScreen(viewModel) */ }
                        composable("mood") { /* MoodScreen(viewModel) */ }
                        composable("movie") { /* MovieSearchScreen(viewModel) */ }
                        composable("genre") { /* GenreScreen(viewModel) */ }
                        composable("history") { /* HistoryScreen(viewModel) */ }
                    }
                }
            }
        }
    }
}
