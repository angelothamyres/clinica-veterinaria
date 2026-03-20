<template>
  <div class="page">
    <Navbar />

    <div class="container">
      <div class="hero">
        <h1>Agendar Consulta Veterinária</h1>
        <p>Cadastre consultas, acompanhe status e reorganize horários com facilidade.</p>
      </div>

      <div class="grid">
        <div class="form-card">
          <h2>Novo agendamento</h2>

          <form @submit.prevent="handleSchedule">
            <input v-model="form.patientName" placeholder="Nome do responsável" required />
            <input v-model="form.patientEmail" type="email" placeholder="E-mail do responsável" required />
            <input v-model="form.petName" placeholder="Nome do pet" required />

            <select v-model="form.specialty" required>
              <option disabled value="">Selecione a especialidade</option>
              <option>Clínico Geral</option>
              <option>Vacinação</option>
              <option>Dermatologia</option>
              <option>Ortopedia</option>
              <option>Odontologia</option>
              <option>Exames</option>
            </select>

            <input v-model="form.date" type="date" required />
            <input v-model="form.time" type="time" required />
            <input v-model="form.cep" placeholder="CEP" @blur="buscarCep" required />
            <input v-model="form.address" placeholder="Endereço" readonly required />

            <button type="submit">Agendar consulta</button>
          </form>

          <p class="message">{{ message }}</p>
        </div>

        <div class="list-card">
          <h2>Minhas consultas</h2>

          <div v-for="item in appointments" :key="item._id" class="card">
            <div class="card-top">
              <div>
                <h3>{{ item.petName }}</h3>
                <p><strong>Responsável:</strong> {{ item.patientName }}</p>
                <p><strong>Especialidade:</strong> {{ item.specialty }}</p>
                <p><strong>Data:</strong> {{ item.date }} às {{ item.time }}</p>
                <p><strong>Endereço:</strong> {{ item.address }}</p>
                <p><strong>Clima:</strong> {{ item.weatherAlert }}</p>
                <p><strong>Status:</strong> <span class="status">{{ item.status }}</span></p>
              </div>
            </div>

            <div class="actions">
              <button class="secondary" @click="cancelAppointment(item._id)">Cancelar</button>
              <button class="warning" @click="rescheduleAppointment(item._id)">Remarcar</button>
              <button class="danger" @click="deleteAppointment(item._id)">Excluir</button>
            </div>
          </div>

          <p v-if="appointments.length === 0" class="empty">Nenhuma consulta cadastrada ainda.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../services/api'
import Navbar from '../components/Navbar.vue'

const form = ref({
  patientName: '',
  patientEmail: '',
  petName: '',
  specialty: '',
  date: '',
  time: '',
  cep: '',
  address: ''
})

const message = ref('')
const appointments = ref([])

const buscarCep = async () => {
  try {
    const cepLimpo = form.value.cep.replace(/\D/g, '')
    const response = await api.get(`/external/cep/${cepLimpo}`)
    form.value.address = `${response.data.logradouro}, ${response.data.bairro}, ${response.data.localidade} - ${response.data.uf}`
  } catch {
    message.value = 'Erro ao buscar CEP.'
  }
}

const loadMyAppointments = async () => {
  try {
    const response = await api.get('/appointments/my')
    appointments.value = response.data
  } catch {
    message.value = 'Erro ao carregar consultas.'
  }
}

const handleSchedule = async () => {
  try {
    await api.post('/appointments', form.value)
    message.value = 'Consulta agendada com sucesso!'
    form.value = {
      patientName: '',
      patientEmail: '',
      petName: '',
      specialty: '',
      date: '',
      time: '',
      cep: '',
      address: ''
    }
    loadMyAppointments()
  } catch (error) {
    message.value = error.response?.data?.message || 'Erro ao agendar consulta.'
  }
}

const cancelAppointment = async (id) => {
  try {
    await api.put(`/appointments/${id}/cancel`)
    loadMyAppointments()
  } catch {
    message.value = 'Erro ao cancelar consulta.'
  }
}

const deleteAppointment = async (id) => {
  const confirmDelete = window.confirm('Tem certeza que deseja excluir esta consulta?')

  if (!confirmDelete) return

  try {
    await api.delete(`/appointments/${id}`)
    message.value = 'Consulta excluída com sucesso.'
    loadMyAppointments()
  } catch {
    message.value = 'Erro ao excluir consulta.'
  }

}

const rescheduleAppointment = async (id) => {
  const newDate = prompt('Digite a nova data no formato AAAA-MM-DD:')
  const newTime = prompt('Digite o novo horário no formato HH:MM:')

  if (!newDate || !newTime) return

  try {
    await api.put(`/appointments/${id}/reschedule`, {
      date: newDate,
      time: newTime
    })
    loadMyAppointments()
  } catch (error) {
    message.value = error.response?.data?.message || 'Erro ao remarcar consulta.'
  }
}

onMounted(loadMyAppointments)
</script>

<style scoped>
input, select {
  box-sizing: border-box;
}

.page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f3ff, #ecfdf5);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px 20px;
}

.hero {
  text-align: center;
  margin-bottom: 28px;
}

.hero h1 {
  color: #5b21b6;
  font-size: 34px;
  margin-bottom: 8px;
}

.hero p {
  color: #4b5563;
}

.grid {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 24px;
}

.form-card, .list-card {
  background: white;
  border-radius: 24px;
  padding: 24px;
  box-shadow: 0 12px 30px rgba(0,0,0,0.08);
}

h2 {
  color: #166534;
  margin-bottom: 16px;
}

input, select, button {
  width: 100%;
  margin: 8px 0;
  padding: 13px;
  border-radius: 12px;
  border: 1px solid #d1d5db;
  font-size: 15px;
}

input:focus, select:focus {
  outline: none;
  border-color: #7c3aed;
  box-shadow: 0 0 0 3px rgba(124,58,237,0.12);
}

button {
  border: none;
  cursor: pointer;
  font-weight: 600;
}

form button {
  background: linear-gradient(90deg, #7c3aed, #16a34a);
  color: white;
}

.card {
  background: linear-gradient(180deg, #faf5ff, #f0fdf4);
  border: 1px solid #e9d5ff;
  border-radius: 18px;
  padding: 18px;
  margin-top: 14px;
}

.card h3 {
  color: #6d28d9;
  margin-bottom: 8px;
}

.actions {
  display: flex;
  gap: 10px;
  margin-top: 14px;
}

.actions button {
  flex: 1;
}

.secondary {
  background: #16a34a;
  color: white;
}

.warning {
  background: #7c3aed;
  color: white;
}

.danger {
  background: #dc2626;
  color: white;
}

.status {
  color: #166534;
  font-weight: bold;
  text-transform: capitalize;
}

.message {
  margin-top: 10px;
  color: #166534;
}

.empty {
  color: #6b7280;
  margin-top: 20px;
}

@media (max-width: 900px) {
  .grid {
    grid-template-columns: 1fr;
  }

  .actions {
    flex-direction: column;
  }
  
}
</style>