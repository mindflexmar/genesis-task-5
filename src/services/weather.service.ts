import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class WeatherService {
	private readonly getWeatherUrl = 'http://api.weatherapi.com/v1/current.json';

  constructor(private readonly configService: ConfigService) {}

  public async getWeatherByCity(city: string): Promise<{ temperature: number; humidity: number; description: string }> {
		const weatherApiKey = this.configService.get<string>('WEATHER_API_KEY');
		const url = `${this.getWeatherUrl}?key=${weatherApiKey}&q=${city}`;
		const response = await fetch(url);
		if (!response.ok) {
			throw new Error(`Error fetching weather data: ${response.statusText}`);
		}
		const data = await response.json();
		const weather = {
			temperature: data.current.temp_c,
			humidity: data.current.humidity,
			description: data.current.condition.text,
		}
		return weather;
  }
}
