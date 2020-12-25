const { Sequelize, Model, DataTypes } = require("sequelize");
const express = require("express");
const { type } = require("os");

const sequelize = new Sequelize("sqlite:./contacts.db", {
    logging: false,
    dialect: "sqlite",
    define: {
        timestamps: false,
    },
});

class Contact extends Model { }
Contact.init(
    {
        name: DataTypes.STRING,
        number: DataTypes.STRING,
    },
    { sequelize, modelName: "contact" }
);
const app = express();
app.use(express.json())
const port = 3000;

(async () => {
    await sequelize.sync({ alter: true });
    /* const alex = await User.create({
      username: "Alex",
      salary: 250_000,
    }); // create */

    app.get('/contacts', async (req, res) => {
        const all = await Contact.findAll();
        res.send(JSON.stringify(all))
    });


    app.post('/contact', async (req, res) => {
        console.log(req.body);
        console.log(typeof req.body);
        res.status(201).send('ok');
        const contact = await Contact.create({
            name: req.body.name,
            number: req.body.number,
        });
    });

    app.put('/contact', async (req, res) => {
        const contact = await Contact.findOne({ where: { id: req.body.id } });
        if (contact !== null) {
            contact.name = req.body.name;
            contact.number = req.body.number;
            await contact.save();
            res.send(JSON.stringify(contact.dataValues))
        } else {
            res.status(404).send('Sorry cant find that!');
        }
    })

    app.delete('/contact/:id', async (req,res) =>{
        const contact = await Contact.findOne({ where: { id: req.params.id } });
        console.log(contact.toJSON());
        await contact.destroy()
        res.status(200).send('User was deleted!');
    })

})();

app.listen(port, () => {
    console.log(`Сервер был запущен: http://localhost:${port}\n`);
})