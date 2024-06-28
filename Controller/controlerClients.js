const { Clients } = require("../models/clients");

// Função para criar um novo cliente
exports.createClient = async (req, res) => {
  const { name, cAdress, email, telf, nif } = req.body;

  try {
    // Verificar se já existe um cliente com o mesmo nome
    const existingClient = await Clients.findOne({ name });

    if (existingClient) {
      return res
        .status(400)
        .json({ message: "Client with the same name already exists" });
    }

    // Se nenhum cliente correspondente for encontrado, criar um novo
    const newClient = new Clients({
      name,
      cAdress,
      email,
      telf,
      nif,
    });

    const createdClient = await newClient.save();
    res.status(201).json({ success: true, data: createdClient });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Função para obter todos os clientes
exports.getClients = async (req, res) => {
  try {
    const clients = await Clients.find();
    res.status(200).json({ success: true, data: clients });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Função para obter um único cliente por ID
exports.getClientById = async (req, res) => {
  const { id } = req.params;
  try {
    const client = await Clients.findById(id);
    if (!client) {
      return res
        .status(404)
        .json({ success: false, error: "Client not found" });
    }
    res.status(200).json({ success: true, data: client });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Função para atualizar um cliente por ID
exports.updateClient = async (req, res) => {
  const { id } = req.params;
  try {
    const client = await Clients.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!client) {
      return res
        .status(404)
        .json({ success: false, error: "Client not found" });
    }
    res.status(200).json({ success: true, data: client });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Função para excluir um cliente por ID
exports.deleteClient = async (req, res) => {
  const { id } = req.params;
  try {
    const client = await Clients.findByIdAndDelete(id);
    if (!client) {
      return res
        .status(404)
        .json({ success: false, error: "Client not found" });
    }
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
