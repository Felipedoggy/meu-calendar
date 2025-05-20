import React, { useState, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import ptBrLocale from '@fullcalendar/core/locales/pt-br';

import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button, Form, Badge } from 'react-bootstrap';

const colorOptions = [
  { color: '#3788d8', label: 'Azul' },
  { color: '#e74c3c', label: 'Vermelho' },
  { color: '#2ecc71', label: 'Verde' },
  { color: '#f39c12', label: 'Laranja' },
  { color: '#9b59b6', label: 'Roxo' },
];

function App() {
  const [events, setEvents] = useState([
    {
      id: '1',
      title: 'Festa Junina',
      start: '2025-06-10T14:00:00',
      end: '2025-06-10T18:00:00',
      color: '#3788d8',
      location: 'Pátio Principal',
      description:
        'Festa tradicional com comidas típicas, música e dança para todos os residentes.',
      notify: true,
      notifyTime: 60,
      type: 'Social',
    },
    {
      id: '2',
      title: 'Palestra sobre Saúde',
      start: '2025-06-15T10:00:00',
      end: '2025-06-15T11:30:00',
      color: '#e74c3c',
      location: 'Auditório',
      description: 'Palestra para conscientização sobre saúde.',
      notify: false,
      notifyTime: null,
      type: 'Educativo',
    },
    {
      id: '3',
      title: 'Aniversário Coletivo',
      start: '2025-06-20T15:00:00',
      end: '2025-06-20T17:00:00',
      color: '#2ecc71',
      location: 'Sala de Eventos',
      description: 'Comemoração de aniversários do mês.',
      notify: true,
      notifyTime: 60,
      type: 'Celebração',
    },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    color: '#3788d8',
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    location: '',
    description: '',
    notify: false,
    notifyTime: '60',
    type: '',
  });

  const formRef = useRef();

  // Correção importante no handleEventClick:
  // O info.event.start é um objeto Date, então comparar string com Date não funciona.
  // Vamos buscar pelo id, que é único e está disponível em info.event.id
  function handleEventClick(info) {
    const event = events.find((e) => e.id === info.event.id);
    if (event) {
      setSelectedEvent(event);
      setShowViewModal(true);
    }
  }

  function handleSaveEvent() {
    if (!formRef.current.checkValidity()) {
      formRef.current.reportValidity();
      return;
    }

    const start = new Date(formData.startDate + 'T' + formData.startTime);
    const end = new Date(formData.endDate + 'T' + formData.endTime);

    // Validação simples para data/hora lógica
    if (end <= start) {
      alert('A data/hora de término deve ser posterior à data/hora de início.');
      return;
    }

    const newEvent = {
      id: (events.length + 1).toString(),
      title: formData.title,
      start: start.toISOString(),
      end: end.toISOString(),
      color: formData.color,
      location: formData.location,
      description: formData.description,
      notify: formData.notify,
      notifyTime: formData.notify ? parseInt(formData.notifyTime) : null,
      type: formData.type || 'Social',
    };

    setEvents([...events, newEvent]);
    setShowAddModal(false);

    setFormData({
      title: '',
      color: '#3788d8',
      startDate: '',
      endDate: '',
      startTime: '',
      endTime: '',
      location: '',
      description: '',
      notify: false,
      notifyTime: '60',
      type: '',
    });
  }

  function handleInputChange(e) {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  }

  function handleDeleteEvent(id) {
    if (window.confirm('Deseja realmente excluir este evento?')) {
      setEvents(events.filter((e) => e.id !== id));
      // Se estiver visualizando o evento excluído, fecha o modal
      if (selectedEvent && selectedEvent.id === id) {
        setShowViewModal(false);
        setSelectedEvent(null);
      }
    }
  }

  function getBadgeColor(type) {
    switch (type.toLowerCase()) {
      case 'social':
        return 'primary';
      case 'educativo':
        return 'success';
      case 'celebração':
      case 'celebracao':
        return 'info';
      default:
        return 'secondary';
    }
  }

  const upcomingEvents = events
    .filter((e) => new Date(e.start) >= new Date())
    .sort((a, b) => new Date(a.start) - new Date(b.start))
    .slice(0, 5);

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <div
        className="sidebar p-3"
        style={{
          backgroundColor: '#2c3e50',
          color: 'white',
          height: '100vh',
          position: 'fixed',
          width: '250px',
        }}
      >
        <div className="d-flex align-items-center mb-4">
          <h4 className="m-0">SATA</h4>
        </div>
        <ul className="nav flex-column">
          <li className="nav-item">
            <a className="nav-link text-white" href="#">
              <i className="bi bi-speedometer2"></i> Dashboard
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link active text-white" href="#">
              <i className="bi bi-calendar-event"></i> Eventos
            </a>
          </li>
        </ul>
      </div>

      {/* Main content */}
      <div
        className="main-content flex-grow-1"
        style={{ marginLeft: '250px', padding: '20px' }}
      >
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Gerenciamento de Eventos</h2>
          <Button variant="primary" onClick={() => setShowAddModal(true)}>
            <i className="bi bi-plus-circle"></i> Novo Evento
          </Button>
        </div>

        <div className="row mb-4">
          <div className="col-md-8">
            <div className="card">
              <div className="card-body">
                <FullCalendar
                  plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                  initialView="dayGridMonth"
                  locale={ptBrLocale}
                  headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek,timeGridDay',
                  }}
                  events={events.map((e) => ({
                    id: e.id,
                    title: e.title,
                    start: e.start,
                    end: e.end,
                    color: e.color,
                    extendedProps: {
                      location: e.location,
                      description: e.description,
                    },
                  }))}
                  eventClick={handleEventClick}
                  height="auto"
                />
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card">
              <div className="card-header">
                <h5 className="mb-0">Próximos Eventos</h5>
              </div>
              <div className="card-body">
                {upcomingEvents.length === 0 && <p>Nenhum evento próximo.</p>}
                {upcomingEvents.map((ev) => (
                  <div
                    key={ev.id}
                    className="event-card card mb-3"
                    style={{ borderLeftColor: ev.color, cursor: 'default' }}
                  >
                    <div className="card-body">
                      <h5 className="card-title">{ev.title}</h5>
                      <p className="card-text mb-1">
                        <i className="bi bi-calendar-date"></i>{' '}
                        {new Date(ev.start).toLocaleDateString('pt-BR')}
                      </p>
                      <p className="card-text mb-1">
                        <i className="bi bi-clock"></i>{' '}
                        {new Date(ev.start).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}{' '}
                        -{' '}
                        {new Date(ev.end).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                      <p className="card-text">
                        <i className="bi bi-geo-alt"></i> {ev.location}
                      </p>
                      <div className="d-flex justify-content-end">
                        <Button
                          variant="outline-primary"
                          size="sm"
                          className="me-1"
                          onClick={() => {
                            setSelectedEvent(ev);
                            setShowViewModal(true);
                          }}
                        >
                          <i className="bi bi-pencil"></i>
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDeleteEvent(ev.id)}
                        >
                          <i className="bi bi-trash"></i>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Adicionar Evento */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Novo Evento</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form ref={formRef}>
            <Form.Group className="mb-3" controlId="formTitle">
              <Form.Label>Título*</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formColor">
              <Form.Label>Cor</Form.Label>
              <Form.Select
                name="color"
                value={formData.color}
                onChange={handleInputChange}
              >
                {colorOptions.map((opt) => (
                  <option key={opt.color} value={opt.color}>
                    {opt.label}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formStartDate">
              <Form.Label>Data de Início*</Form.Label>
              <Form.Control
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formStartTime">
              <Form.Label>Hora de Início*</Form.Label>
              <Form.Control
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formEndDate">
              <Form.Label>Data de Término*</Form.Label>
              <Form.Control
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formEndTime">
              <Form.Label>Hora de Término*</Form.Label>
              <Form.Control
                type="time"
                name="endTime"
                value={formData.endTime}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formLocation">
              <Form.Label>Localização*</Form.Label>
              <Form.Control
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formDescription">
              <Form.Label>Descrição*</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formNotify">

<Form.Check
type="checkbox"
label="Notificar antes do evento"
name="notify"
checked={formData.notify}
onChange={handleInputChange}
/>
</Form.Group>        {formData.notify && (
          <Form.Group className="mb-3" controlId="formNotifyTime">
            <Form.Label>Minutos antes para notificação</Form.Label>
            <Form.Control
              type="number"
              min="1"
              name="notifyTime"
              value={formData.notifyTime}
              onChange={handleInputChange}
            />
          </Form.Group>
        )}

        <Form.Group className="mb-3" controlId="formType">
          <Form.Label>Tipo de Evento</Form.Label>
          <Form.Select name="type" value={formData.type} onChange={handleInputChange}>
            <option value="">Selecione</option>
            <option value="Social">Social</option>
            <option value="Educativo">Educativo</option>
            <option value="Celebração">Celebração</option>
          </Form.Select>
        </Form.Group>
      </Form>
    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={() => setShowAddModal(false)}>
        Cancelar
      </Button>
      <Button variant="primary" onClick={handleSaveEvent}>
        Salvar
      </Button>
    </Modal.Footer>
  </Modal>

  {/* Modal Visualizar Evento */}
  <Modal
    show={showViewModal}
    onHide={() => setShowViewModal(false)}
    centered
    size="lg"
  >
    <Modal.Header closeButton>
      <Modal.Title>{selectedEvent?.title}</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      {selectedEvent && (
        <>
          <p>
            <strong>Data:</strong>{' '}
            {new Date(selectedEvent.start).toLocaleDateString('pt-BR')}
          </p>
          <p>
            <strong>Hora:</strong>{' '}
            {new Date(selectedEvent.start).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}{' '}
            -{' '}
            {new Date(selectedEvent.end).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
          <p>
            <strong>Localização:</strong> {selectedEvent.location}
          </p>
          <p>
            <strong>Descrição:</strong> {selectedEvent.description}
          </p>
          <p>
            <strong>Tipo:</strong>{' '}
            <Badge bg={getBadgeColor(selectedEvent.type)}>
              {selectedEvent.type}
            </Badge>
          </p>
          <p>
            <strong>Notificação:</strong>{' '}
            {selectedEvent.notify
              ? `Sim, ${selectedEvent.notifyTime} minutos antes`
              : 'Não'}
          </p>
        </>
      )}
    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={() => setShowViewModal(false)}>
        Fechar
      </Button>
      <Button
        variant="danger"
        onClick={() => {
          if (selectedEvent) handleDeleteEvent(selectedEvent.id);
        }}
      >
        Excluir
      </Button>
    </Modal.Footer>
  </Modal>
</div>
);
}
export default App;