const expressHandler = require("express-async-handler");
const { Image } = require("../models/models");
const { upload } = require("../utilities/upload");

// Middleware para lidar com o upload de uma única imagem
exports.uploadSingleImage = expressHandler(async (req, res) => {
  upload.single("image")(req, res, async (err) => {
    if (err) {
      return res
        .status(400)
        .json({ message: "Erro ao fazer upload da imagem", error: err });
    }

    try {
      const newImage = new Image({
        filename: req.file.originalname,
        contentType: req.file.mimetype,
        imageBuffer: req.file.buffer,
      });
      const savedImage = await newImage.save();
      res
        .status(201)
        .json({ message: "Imagem enviada com sucesso", image: savedImage });
    } catch (saveError) {
      res.status(500).json({
        message: "Erro ao salvar imagem no banco de dados",
        error: saveError,
      });
    }
  });
});

// Middleware para lidar com o upload de múltiplas imagens
exports.uploadImages = expressHandler(async (req, res) => {
  upload.array("images")(req, res, async (err) => {
    if (err) {
      return res
        .status(400)
        .json({ message: "Erro ao fazer upload das imagens", error: err });
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
      res.status(201).json({ message: "Imagens enviadas com sucesso", images });
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
    const image = await Image.findById(req.params.id);
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
