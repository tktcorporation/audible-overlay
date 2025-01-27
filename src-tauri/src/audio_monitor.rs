use cpal::traits::{DeviceTrait, HostTrait, StreamTrait};
use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::{Arc, Mutex};
use std::time::Duration;

#[derive(serde::Serialize)]
pub struct AudioDevice {
    name: String,
    id: String,
}

pub struct AudioMonitor {
    is_active: Arc<AtomicBool>,
    stream: Arc<Mutex<Option<Box<dyn StreamTrait>>>>,
}

unsafe impl Send for AudioMonitor {}
unsafe impl Sync for AudioMonitor {}

impl AudioMonitor {
    pub fn new() -> Self {
        AudioMonitor {
            is_active: Arc::new(AtomicBool::new(false)),
            stream: Arc::new(Mutex::new(None)),
        }
    }

    pub fn get_input_devices() -> Result<Vec<AudioDevice>, Box<dyn std::error::Error>> {
        let host = cpal::default_host();
        let devices = host.input_devices()?;
        
        let audio_devices: Vec<AudioDevice> = devices
            .filter_map(|device| {
                let name = device.name().ok()?;
                Some(AudioDevice { 
                    name: name.clone(), 
                    id: name 
                })
            })
            .collect();

        Ok(audio_devices)
    }

    pub fn start_monitoring_with_device(&self, device_name: &str) -> Result<(), Box<dyn std::error::Error>> {
        let host = cpal::default_host();
        let mut devices = host.input_devices()?;
        
        let device = devices
            .find(|d| d.name().map(|n| n == device_name).unwrap_or(false))
            .ok_or("指定された入力デバイスが見つかりません")?;

        let config = device.default_input_config()?;
        let is_active = self.is_active.clone();

        if let Some(stream) = self.stream.lock().unwrap().take() {
            drop(stream);
        }

        let stream = device.build_input_stream(
            &config.into(),
            move |data: &[f32], _: &_| {
                let is_speaking = data.iter().any(|&sample| sample.abs() > 0.1);
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
} 