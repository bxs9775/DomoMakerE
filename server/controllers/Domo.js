const models = require('../models');

const Domo = models.Domo;

// Sends the main app/maker page to client
const makerPage = (req, res) => {
  Domo.DomoModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }
    return res.render('app', { csrfToken: req.csrfToken(), domos: docs });
  });
};

// Handles making a new domo object and sending it to the database
const makeDomo = (req, res) => {
  if (!req.body.name || !req.body.age) {
    return res.status(400).json({ error: 'RAWR! Both name and age are required' });
  }

  const favoriteFood = req.body.favoriteFood || 'unknown';
  const leastFavoriteFood = req.body.leastFavoriteFood || 'unknown';

  const domoData = {
    name: req.body.name,
    age: req.body.age,
    favoriteFood,
    leastFavoriteFood,
    owner: req.session.account._id,
  };

  const newDomo = new Domo.DomoModel(domoData);

  const domoPromise = newDomo.save();

  domoPromise.then(() => res.json({ redirect: '/maker' }));

  domoPromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Domo already exists. ' });
    }
    return res.status(400).json({ error: 'An error occurred' });
  });

  return domoPromise;
};

// Retrieves a list of the current user's domos from the database
const getDomos = (request, response) => {
  const req = request;
  const res = response;

  return Domo.DomoModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);

      return res.status(400).json({ error: 'An error occured.' });
    }

    return res.json({ domos: docs });
  });
};

// Updates an existing Domo
const updateDomo = (request, response) => {
  const req = request;
  const res = response;

  if (!req.body._id) {
    return res.status(400).json({ error: 'Request requires a domoId value.' });
  }

  return Domo.DomoModel.findByID(req.body._id, (err, docs) => {
    if (err) {
      console.log(err);

      return res.status(400).json({ error: 'An error occured.' });
    }

    // console.log(docs);

    if (docs.owner.toString() !== req.session.account._id) {
      return res.status(403).json({ error: 'You can\'t edit domos you don\'t own!' });
    }
    const tempDomo = docs;
    // update domo values
    if (req.body.name) {
      tempDomo.name = req.body.name;
    }

    if (req.body.age) {
      // Check correct value?
      tempDomo.age = req.body.age;
    }

    if (req.body.favoriteFood) {
      tempDomo.favoriteFood = req.body.favoriteFood;
    }

    if (req.body.leastFavoriteFood) {
      tempDomo.leastFavoriteFood = req.body.leastFavoriteFood;
    }

    tempDomo.updatedDate = Date.now();

    // handle save promise
    const updatePromise = tempDomo.save();

    updatePromise.then(() => res.status(204).send(''));

    updatePromise.catch((e) => {
      console.log(e);

      return res.status(400).json({ error: 'An error occured.' });
    });
    return updatePromise;
  });
};

module.exports.makerPage = makerPage;
module.exports.make = makeDomo;
module.exports.getDomos = getDomos;
module.exports.updateDomo = updateDomo;
