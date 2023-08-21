const fs = require('fs');
const Sauces = require('../models/Sauces');

exports.createSauces = async (req, res, next) => {
  try {
    const saucesObject = JSON.parse(req.body.sauce);
    delete saucesObject._id;
    
    const sauces = new Sauces({
      ...saucesObject,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });

    await sauces.save();
    res.status(201).json({ message: 'Post saved successfully!' });
  } catch (error) {
    res.status(400).json({ message: error });
  }
};

exports.getOneSauces = async (req, res, next) => {
  try {
    const sauces = await Sauces.findOne({ _id: req.params.id });
    res.status(200).json(sauces);
  } catch (error) {
    res.status(404).json({ error });
  }
};


exports.modifySauces = (req, res, next) => {
  Sauces.findOne({ _id: req.params.id }).then((sauces) => {
    const filename = sauces.imageUrl.split("/images/")[1];
    fs.unlink(`images/${filename}`, () => {
      const saucesObject = req.file
        ? {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get("host")}/images/${
              req.file.filename
            }`,
          }
        : { ...req.body };
      Sauces.updateOne(
        { _id: req.params.id },
        { ...saucesObject, _id: req.params.id }
      )
        .then(() => res.status(200).json({ message: "Sauce modifiée !" }))
        .catch((error) => res.status(400).json({ error }));
    });
  });
};

exports.deleteSauces = async (req, res, next) => {
  try {
    const sauce = await Sauces.findOne({ _id: req.params.id });

    if (!sauce) {
      return res.status(404).json({ error: new Error('No such Sauce!') });
    } else if (sauce.userId !== req.auth.userId) {
      return res.status(400).json({ error: new Error('Unauthorized request!') });
    }

    const filename = sauce.imageUrl.split('/images/')[1];
    fs.unlink(`images/${filename}`, async (error) => {
      if (error) {
        return res.status(500).json({ error: "Erreur lors de la suppression de l'image." });
      }

      await Sauces.deleteOne({ _id: req.params.id });
      res.status(200).json({ message: 'Deleted!' });
    });
  } catch (error) {
    res.status(400).json({ error });
  }
};

exports.getAllSauces = async (req, res, next) => {
  try {
    const sauces = await Sauces.find();
    res.status(200).json(sauces);
  } catch (error) {
    res.status(400).json({ error });
  }
};

exports.likeSauces = async (req, res, next) => {
  const { like, userId } = req.body;

  if (![1, 0, -1].includes(like)) {
    return res.status(403).send({ message: "Like/Dislike: Quantité invalide !" });
  }

  try {
    const sauce = await Sauces.findOne({ _id: req.params.id });

    if (!sauce) {
      return res.status(404).json({ error: "Sauce non trouvée." });
    }

    switch (like) {
      case 1:
        sauce.likes++;
        sauce.usersLiked.push(userId);
        break;

      case -1:
        sauce.dislikes++;
        sauce.usersDisliked.push(userId);
        break;

      default:
        const userLikedIndex = sauce.usersLiked.indexOf(userId);
        if (userLikedIndex !== -1) {
          sauce.likes--;
          sauce.usersLiked.splice(userLikedIndex, 1);
        }

        const userDislikedIndex = sauce.usersDisliked.indexOf(userId);
        if (userDislikedIndex !== -1) {
          sauce.dislikes--;
          sauce.usersDisliked.splice(userDislikedIndex, 1);
        }
    }

    await sauce.save();

    const responseMessage = like === 1 ? 'Like ajouté !' : like === -1 ? 'Dislike ajouté !' : 'Like/Dislike supprimé !';
    res.status(200).json({ message: responseMessage });
  } catch (error) {
    res.status(400).json({ error });
  }
};
