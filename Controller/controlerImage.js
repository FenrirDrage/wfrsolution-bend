const expressHandler = require("express-async-handler");
const multer = require("multer");
const { Image } = require("../models/models");
//const { upload } = require("../utilities/upload");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

exports.uploadSingleImage = expressHandler(async (req, res) => {
  upload.single("image")(req, res, async (err) => {
    if (err) {
      return res
        .status(400)
        .json({ message: "Erro ao fazer upload da imagem", error: err });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Nenhum arquivo enviado" });
    }

    try {
      const newImage = new Image({
        filename: req.file.originalname,
        contentType: req.file.mimetype,
        imageBuffer: req.file.buffer,
      });

      const savedImage = await newImage.save();

      res.status(201).json({
        message: "Imagem enviada com sucesso",
        image: {
          _id: savedImage._id,
          filename: savedImage.filename,
          contentType: savedImage.contentType,
        },
      });
    } catch (saveError) {
      res.status(500).json({
        message: "Erro ao salvar imagem no banco de dados",
        error: saveError,
      });
    }
  });
});

exports.uploadImages = expressHandler(async (req, res) => {
  upload.array("images")(req, res, async (err) => {
    if (err) {
      return res
        .status(400)
        .json({ message: "Erro ao fazer upload das imagens", error: err });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "Nenhuma imagem enviada" });
    }

    try {
      const imagePromises = req.files.map((file) => {
        const newImage = new Image({
          filename: file.originalname,
          contentType: file.mimetype,
          imageBuffer: file.buffer,
        });
        return newImage.save();
      });

      const images = await Promise.all(imagePromises);
      const imageResponses = images.map((image) => ({
        _id: image._id,
        filename: image.filename,
        contentType: image.contentType,
      }));
      res.status(201).json({
        message: "Imagens enviadas com sucesso",
        images: imageResponses,
      });
    } catch (saveError) {
      res.status(500).json({
        message: "Erro ao salvar imagens no banco de dados",
        error: saveError,
      });
    }
  });
});

// Middleware para ler uma imagem
exports.readImage = expressHandler(async (req, res) => {
  try {
    const { id } = req.params;

    // Verificação básica do formato do ID
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "ID de imagem inválido" });
    }

    const image = await Image.findById(id);
    if (!image) {
      return res.status(404).json({ message: "Imagem não encontrada" });
    }

    res.set("Content-Type", image.contentType);
    res.set("Content-Disposition", `attachment; filename="${image.filename}"`);
    res.send(image.imageBuffer);
  } catch (err) {
    res.status(500).json({
      message: "Erro ao recuperar imagem do banco de dados",
      error: err,
    });
  }
});

// Middleware para deletar uma imagem
exports.deleteImage = expressHandler(async (req, res) => {
  try {
    const image = await Image.findByIdAndDelete(req.params.id);
    if (!image) {
      return res.status(404).json({ message: "Imagem não encontrada" });
    }
    res.status(200).json({ message: "Imagem deletada com sucesso" });
  } catch (err) {
    res.status(500).json({
      message: "Erro ao deletar imagem do banco de dados",
      error: err,
    });
  }
});

// Middleware to get all images
exports.getAllImages = expressHandler(async (req, res) => {
  try {
    const images = await Image.find({}, "_id filename contentType");
    res.status(200).json(images);
  } catch (err) {
    res.status(500).json({
      message: "Erro ao recuperar imagens do banco de dados",
      error: err,
    });
  }
});
