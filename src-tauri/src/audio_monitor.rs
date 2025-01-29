use cpal::traits::{DeviceTrait, HostTrait, StreamTrait};
use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::{Arc, Mutex};
use std::time::Duration;
use log::{info, debug};

#[derive(serde::Serialize)]
pub struct AudioDevice {
    name: String,
    id: String,
}

pub struct AudioMonitor {
    is_active: Arc<AtomicBool>,
    stream: Arc<Mutex<Option<Box<dyn StreamTrait>>>>,
    current_level: Arc<Mutex<f32>>,
    threshold: Arc<Mutex<f32>>,
}

unsafe impl Send for AudioMonitor {}
unsafe impl Sync for AudioMonitor {}

impl AudioMonitor {
    pub fn new() -> Self {
        AudioMonitor {
            is_active: Arc::new(AtomicBool::new(false)),
            stream: Arc::new(Mutex::new(None)),
            current_level: Arc::new(Mutex::new(0.0)),
            threshold: Arc::new(Mutex::new(0.001)),
        }
    }

    pub fn get_input_devices() -> Result<Vec<AudioDevice>, Box<dyn std::error::Error>> {
        info!("デバイス一覧の取得を開始");
        
        let host = cpal::default_host();
        let devices = host.input_devices()?;
        let devices: Vec<_> = devices.collect();
        
        debug!("検出されたデバイス数: {}", devices.len());
        
        Ok(devices
            .into_iter()
            .filter_map(|device| {
                let name = device.name().unwrap_or_default();
                debug!("デバイス検出: {}", name);
                Some(AudioDevice { name: name.clone(), id: name })
            })
            .collect())
    }

    pub fn start_monitoring_with_device(&self, device_name: &str) -> Result<(), Box<dyn std::error::Error>> {
        let host = cpal::default_host();
        let mut devices = host.input_devices()?;
        
        let device = devices
            .find(|d| d.name().map(|n| n == device_name).unwrap_or(false))
            .ok_or("指定された入力デバイスが見つかりません")?;

        let config = device.default_input_config()?;
        let is_active = self.is_active.clone();
        let current_level = self.current_level.clone();
        let threshold = self.threshold.clone();

        if let Some(stream) = self.stream.lock().unwrap().take() {
            drop(stream);
        }

        let stream = device.build_input_stream(
            &config.into(),
            move |data: &[f32], _: &_| {
                let level = data.iter().map(|&sample| sample.abs()).fold(0.0f32, f32::max);
                *current_level.lock().unwrap() = level;
                let threshold = *threshold.lock().unwrap();
                let is_speaking = level > threshold;
                is_active.store(is_speaking, Ordering::Relaxed);
            },
            |err| eprintln!("音声ストリームでエラーが発生: {}", err),
            None::<Duration>,
        )?;

        stream.play()?;
        *self.stream.lock().unwrap() = Some(Box::new(stream));
        
        Ok(())
    }

    pub fn is_active(&self) -> bool {
        self.is_active.load(Ordering::Relaxed)
    }

    pub fn get_current_level(&self) -> f32 {
        *self.current_level.lock().unwrap()
    }

    pub fn set_threshold(&self, threshold: f32) {
        *self.threshold.lock().unwrap() = threshold;
    }

    pub fn get_threshold(&self) -> f32 {
        *self.threshold.lock().unwrap()
    }
} 