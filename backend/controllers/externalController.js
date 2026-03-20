const axios = require('axios');

const getAddressByCep = async (req, res) => {
  try {
    const { cep } = req.params;
    const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);

    if (response.data.erro) {
      return res.status(404).json({ message: 'CEP não encontrado.' });
    }

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar CEP.', error: error.message });
  }
};

const getWeatherForecast = async (date, city = 'Rio de Janeiro') => {
  try {
    const apiKey = process.env.OPENWEATHER_API_KEY;
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city},BR&appid=${apiKey}&lang=pt_br&units=metric`
    );

    const forecasts = response.data.list;
    const target = forecasts.find(item => item.dt_txt.startsWith(date));

    if (target) {
      const description = target.weather[0].description.toLowerCase();
      if (description.includes('chuva')) {
        return `Atenção: há previsão de chuva para o dia da consulta.`;
      }
      return `Sem previsão de chuva para o dia da consulta.`;
    }

    return 'Previsão do tempo indisponível para esta data.';
  } catch (error) {
    return 'Não foi possível consultar o clima.';
  }
};

module.exports = { getAddressByCep, getWeatherForecast };