const expressHandler = require('express-async-handler');
const { Image } = require('../models/models');
const { upload } = require('../utilities/upload');

// Middleware para lidar com o upload de imagens
const uploadImage = expressHandler(async (req, res) => {
    upload.single('image')(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: 'Erro ao fazer upload da imagem', error: err });
        }

        // Criar um novo documento de imagem com os dados do buffer
        const newImage = new Image({
            filename: req.file.originalname,
            contentType: req.file.mimetype,
            imageBuffer: req.file.buffer
        });

        try {
            await newImage.save();
            res.status(201).json({ message: 'Imagem enviada com sucesso', image: newImage });
        } catch (saveError) {
            res.status(500).json({ message: 'Erro ao salvar imagem no banco de dados', error: saveError });
        }
    });
});

// Middleware para obter todas as imagens
const getAllImages = expressHandler(async (req, res) => {
    try {
        const images = await Image.find({});
        res.status(200).json(images);
    } catch (err) {
        res.status(500).json({ message: 'Erro ao recuperar imagens do banco de dados', error: err });
    }
});

// Middleware para ler uma imagem
const readImage = expressHandler(async (req, res) => {
    try {
        const image = await Image.findById(req.params.id);
        if (!image) {
            return res.status(404).json({ message: 'Imagem não encontrada' });
        }

        res.set('Content-Type', image.contentType);
        res.set('Content-Disposition', `attachment; filename="${image.filename}"`);
        res.send(image.imageBuffer);
    } catch (err) {
        res.status(500).json({ message: 'Erro ao recuperar imagem do banco de dados', error: err });
    }
});

// Middleware para deletar uma imagem
const deleteImage = expressHandler(async (req, res) => {
    try {
        const image = await Image.findByIdAndDelete(req.params.id);
        if (!image) {
            return res.status(404).json({ message: 'Imagem não encontrada' });
        }
        res.status(200).json({ message: 'Imagem deletada com sucesso' });
    } catch (err) {
        res.status(500).json({ message: 'Erro ao deletar imagem do banco de dados', error: err });
    }
});

module.exports = { uploadImage,getAllImages, readImage, deleteImage };