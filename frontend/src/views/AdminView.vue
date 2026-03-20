<template>
  <div class="page">
    <Navbar />

    <div class="container">
      <div class="hero">
        <h1>Painel Administrativo</h1>
        <p>Gerencie consultas e visualize os pacientes cadastrados da clínica veterinária.</p>
      </div>

      <div class="dashboard-grid">
        <div class="section-card">
          <div class="section-header">
            <h2>Consultas agendadas</h2>
            <span class="badge">{{ appointments.length }}</span>
          </div>

          <div v-for="item in appointments" :key="item._id" class="card">
            <h3>{{ item.petName }}</h3>
            <p><strong>Responsável:</strong> {{ item.patientName }}</p>
            <p><strong>Email:</strong> {{ item.patientEmail }}</p>
            <p><strong>Especialidade:</strong> {{ item.specialty }}</p>
            <p><strong>Data:</strong> {{ item.date }} às {{ item.time }}</p>
            <p><strong>Endereço:</strong> {{ item.address }}</p>
            <p><strong>Clima:</strong> {{ item.weatherAlert }}</p>
            <p><strong>Status:</strong> <span class="status">{{ item.status }}</span></p>

            <div class="actions">
              <button class="secondary" @click="cancelAppointment(item._id)">Cancelar</button>
              <button class="warning" @click="rescheduleAppointment(item._id)">Remarcar</button>
              <button class="danger" @click="deleteAppointment(item._id)">Excluir</button>
            </div>
          </div>

          <p v-if="appointments.length === 0" class="empty">Nenhuma consulta encontrada.</p>
        </div>

        <div class="section-card">
          <div class="section-header">
            <h2>Pacientes cadastrados</h2>
            <span class="badge green">{{ patients.length }}</span>
          </div>

          <div v-for="patient in patients" :key="patient._id" class="patient-card">
            <h3>{{ patient.name }}</h3>
            <p><strong>Email:</strong> {{ patient.email }}</p>
            <p><strong>Perfil:</strong> Responsável pelo pet</p>
          </div>

          <p v-if="patients.length === 0" class="empty">Nenhum paciente cadastrado.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../services/api'
import Navbar from '../components/Navbar.vue'

const appointments = ref([])
const patients = ref([])

const loadAppointments = async () => {
  try {
    const response = await api.get('/appointments')
    appointments.value = response.data
  } catch (error) {
    console.error('Erro ao carregar consultas:', error)
  }
}

const loadPatients = async () => {
  try {
    const response = await api.get('/auth/patients')
    patients.value = response.data
  } catch (error) {
    console.error('Erro ao carregar pacientes:', error)
  }
}

const cancelAppointment = async (id) => {
  try {
    await api.put(`/appointments/${id}/cancel`)
    loadAppointments()
  } catch (error) {
    console.error('Erro ao cancelar consulta:', error)
  }
}

const deleteAppointment = async (id) => {
  const confirmDelete = window.confirm('Tem certeza que deseja excluir esta consulta?')

  if (!confirmDelete) return

  try {
    await api.delete(`/appointments/${id}`)
    loadAppointments()
  } catch (error) {
    console.error('Erro ao excluir consulta:', error)
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
    loadAppointments()
  } catch (error) {
    console.error('Erro ao remarcar consulta:', error)
  }
}

onMounted(() => {
  loadAppointments()
  loadPatients()
})
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f3ff, #ecfdf5);
}

.container {
  max-width: 1300px;
  margin: 0 auto;
  padding: 32px 20px;
}

.hero {
  text-align: center;
  margin-bottom: 28px;
}

.hero h1 {
  color: #5b21b6;
  font-size: 36px;
  margin-bottom: 8px;
}

.hero p {
  color: #4b5563;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: 1.4fr 0.9fr;
  gap: 24px;
}

.section-card {
  background: white;
  border-radius: 24px;
  padding: 24px;
  box-shadow: 0 12px 30px rgba(0,0,0,0.08);
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;
}

.section-header h2 {
  color: #166534;
}

.badge {
  background: #ede9fe;
  color: #6d28d9;
  font-weight: bold;
  padding: 8px 14px;
  border-radius: 999px;
}

.badge.green {
  background: #dcfce7;
  color: #166534;
}

.card,
.patient-card {
  background: linear-gradient(180deg, #faf5ff, #f0fdf4);
  border: 1px solid #ddd6fe;
  border-radius: 18px;
  padding: 18px;
  margin-top: 14px;
}

.card h3,
.patient-card h3 {
  color: #6d28d9;
  margin-bottom: 10px;
}

.actions {
  display: flex;
  gap: 10px;
  margin-top: 14px;
}

.actions button {
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 12px;
  color: white;
  font-weight: 600;
  cursor: pointer;
}

.secondary {
  background: #16a34a;
}

.warning {
  background: #7c3aed;
}

.danger {
  background: #dc2626;
}

.status {
  color: #166534;
  font-weight: bold;
  text-transform: capitalize;
}

.empty {
  color: #6b7280;
  margin-top: 18px;
}

@media (max-width: 980px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }

  .actions {
    flex-direction: column;
  }
}
</style>