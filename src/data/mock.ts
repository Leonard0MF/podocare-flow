export type Appointment = {
  id: string;
  time: string;
  end: string;
  client: string;
  service: string;
  price: string;
};

export const todayAppointments: Appointment[] = [
  {
    id: "1",
    time: "08:30",
    end: "09:30",
    client: "Maria Oliveira",
    service: "Remoção de calosidade",
    price: "R$ 80,00",
  },
  {
    id: "2",
    time: "10:00",
    end: "11:00",
    client: "Carla Mendes",
    service: "Tratamento de unha encravada",
    price: "R$ 120,00",
  },
  {
    id: "3",
    time: "13:30",
    end: "14:30",
    client: "Ana Souza",
    service: "Podologia preventiva",
    price: "R$ 100,00",
  },
  {
    id: "4",
    time: "15:00",
    end: "16:00",
    client: "João Santos",
    service: "Podologia preventiva",
    price: "R$ 100,00",
  },
];

export type Client = {
  id: string;
  name: string;
  phone: string;
  cpf: string;
  birth: string;
};

export const clients: Client[] = [
  {
    id: "ana-souza",
    name: "Ana Souza",
    phone: "(51) 99999-0000",
    cpf: "000.000.000-00",
    birth: "12/03/1990",
  },
  {
    id: "maria-oliveira",
    name: "Maria Oliveira",
    phone: "(51) 98888-0000",
    cpf: "000.000.000-00",
    birth: "05/07/1984",
  },
  {
    id: "carla-mendes",
    name: "Carla Mendes",
    phone: "(51) 97777-0000",
    cpf: "000.000.000-00",
    birth: "22/11/1978",
  },
];

export const clientHistory = [
  { date: "24 AGO", service: "Podologia preventiva", price: "R$ 100,00", payment: "Pix" },
  { date: "10 AGO", service: "Tratamento de unha", price: "R$ 120,00", payment: "Cartão" },
];

export const services = [
  { id: "1", name: "Podologia preventiva", price: "R$ 100,00", duration: "60 minutos" },
  { id: "2", name: "Tratamento de unha encravada", price: "R$ 120,00", duration: "60 minutos" },
  { id: "3", name: "Remoção de calosidade", price: "R$ 80,00", duration: "45 minutos" },
];
