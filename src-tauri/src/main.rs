// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod audio_monitor;
use audio_monitor::{AudioMonitor, AudioDevice};
use std::sync::Mutex;
use tauri::Manager;

#[tauri::command]
fn check_audio_active(state: tauri::State<Mutex<AudioMonitor>>) -> bool {
    state.lock().unwrap().is_active()
}

#[tauri::command]
fn get_input_devices() -> Result<Vec<AudioDevice>, String> {
    AudioMonitor::get_input_devices().map_err(|e| e.to_string())
}

#[tauri::command]
fn set_input_device(device_id: String, state: tauri::State<Mutex<AudioMonitor>>) -> Result<(), String> {
    state.lock().unwrap()
        .start_monitoring_with_device(&device_id)
        .map_err(|e| e.to_string())
}

#[tauri::command]
fn get_window_type(window: tauri::Window) -> String {
    window.label().to_string()
}

#[tauri::command]
fn get_audio_level(state: tauri::State<Mutex<AudioMonitor>>) -> f32 {
    state.lock().unwrap().get_current_level()
}

fn main() {
    let audio_monitor = AudioMonitor::new();

    tauri::Builder::default()
        .manage(Mutex::new(audio_monitor))
        .plugin(tauri_plugin_store::Builder::default().build())
        .invoke_handler(tauri::generate_handler![
            check_audio_active,
            get_input_devices,
            set_input_device,
            get_window_type,
            get_audio_level
        ])
        .setup(|app| {
            // メインウィンドウを表示（デバイス選択用）
            if let Some(main_window) = app.get_webview_window("main") {
                main_window.show()?;
            }

            // オーバーレイウィンドウを取得して最前面に表示
            if let Some(overlay_window) = app.get_webview_window("overlay") {
                // 現在のモニターの情報を取得
                if let Some(monitor) = overlay_window.current_monitor()? {
                    let size = monitor.size();
                    overlay_window.set_size(tauri::Size::Physical(*size))?;
                    overlay_window.set_position(tauri::Position::Physical(tauri::PhysicalPosition { x: 0, y: 0 }))?;
                }
                overlay_window.set_always_on_top(true)?;
                overlay_window.set_ignore_cursor_events(true)?;
                overlay_window.show()?;
            }
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("エラー: Tauriアプリケーションの実行に失敗しました");
}
