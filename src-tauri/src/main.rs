// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod audio_monitor;
use audio_monitor::{AudioMonitor, AudioDevice};
use std::sync::Mutex;
use tauri::Manager;
use serde::Serialize;

#[derive(Serialize)]
struct MonitorInfo {
    id: u32,
    name: String,
    position: (i32, i32),
    size: (u32, u32),
}

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

#[tauri::command]
fn get_available_monitors(window: tauri::Window) -> Result<Vec<MonitorInfo>, String> {
    let monitors: Vec<MonitorInfo> = window
        .available_monitors()
        .map_err(|e| e.to_string())?
        .into_iter()
        .enumerate()
        .map(|(id, monitor)| {
            let position = monitor.position();
            let size = monitor.size();
            let base_name = monitor.name()
                .map(|s| s.to_string())
                .unwrap_or_else(|| format!("Display {}", id + 1));
            let monitor_name = format!("{} ({}x{})", base_name, size.width, size.height);
            MonitorInfo {
                id: id as u32,
                name: monitor_name,
                position: (position.x, position.y),
                size: (size.width, size.height),
            }
        })
        .collect();
    Ok(monitors)
}

#[tauri::command]
fn move_to_monitor(window: tauri::Window, monitor_id: u32) -> Result<(), String> {
    let monitors = window.available_monitors().map_err(|e| e.to_string())?;
    if let Some(monitor) = monitors.get(monitor_id as usize) {
        let position = monitor.position();
        let size = *monitor.size();
        window.set_position(tauri::Position::Physical(tauri::PhysicalPosition {
            x: position.x,
            y: position.y,
        })).map_err(|e| e.to_string())?;
        window.set_size(tauri::Size::Physical(size)).map_err(|e| e.to_string())?;
    }
    Ok(())
}

#[tauri::command]
fn move_overlay_to_monitor(app_handle: tauri::AppHandle, monitor_id: u32) -> Result<(), String> {
    let overlay_window = app_handle
        .get_webview_window("overlay")
        .ok_or_else(|| "オーバーレイウィンドウが見つかりません".to_string())?;

    let monitors = overlay_window.available_monitors().map_err(|e| e.to_string())?;
    if let Some(monitor) = monitors.get(monitor_id as usize) {
        let position = monitor.position();
        let size = *monitor.size();
        overlay_window.set_position(tauri::Position::Physical(tauri::PhysicalPosition {
            x: position.x,
            y: position.y,
        })).map_err(|e| e.to_string())?;
        overlay_window.set_size(tauri::Size::Physical(size)).map_err(|e| e.to_string())?;
    }
    Ok(())
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
            get_audio_level,
            get_available_monitors,
            move_to_monitor,
            move_overlay_to_monitor
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
