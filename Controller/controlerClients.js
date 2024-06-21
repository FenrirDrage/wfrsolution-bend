const { Clients } = require("../models/models");

// Função para criar um novo cliente
exports.createClient = async (req, res) => {
  try {
    const client = await Clients.create(req.body);
    res.status(201).json({ success: true, data: client });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
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
