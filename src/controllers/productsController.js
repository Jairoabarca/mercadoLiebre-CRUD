const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));

const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const controller = {
	// Root - Show all products
	index: (req, res) => {
		return res.render('products',{
			products,
			toThousand
		});
	},

	// Detail - Detail from one product
	detail: (req, res) => {
		// Do the magic
		const product=products.find(p =>p.id === +req.params.id)
		return res.render('detail',{...product , toThousand})
	},

	// Create - Form to create
	create: (req, res) => {
		// Do the magic
		return res.render('product-create-form')
	},
	
	// Create -  Method to store
	store: (req, res) => {
		// Do the magic
		const ultimoID = products[products.length-1].id
		const {name,discount,price,category,description} = req.body
		const nuevoProducto = {
			"id": ultimoID+1,
			"name": name.trim(),
			"price": +price,
			"discount": discount,
			"category": category,
			"description": description.trim(),
			"image": "default-image.png"
		}
		products.push(nuevoProducto);
		//return res.send(req.body)
		fs.writeFileSync(productsFilePath,JSON.stringify(products),'utf-8') 
		return res.redirect('/products/detail/' + nuevoProducto.id) 

	},

	// Update - Form to edit
	edit: (req, res) => {
		const product = products.find((p) => p.id === +req.params.id)
		return res.render('product-edit-form', {...product})
	},
	// Update - Method to update
	update: (req, res) => {
		// Do the magic
		const {name,discount,price,category,description} = req.body
		const productosSubir = products.map(p => {
			if (p.id === +req.params.id) {
				p.name= name.trim()
				p.price= +price
				p.discount= discount
				p.category= category
				p.description= description.trim()
			}
			return p;
		})
		fs.writeFileSync(productsFilePath,JSON.stringify(productosSubir),'utf-8') 
		return res.redirect('/products/detail/' + req.params.id) 
	},

	// Delete - Delete one product from DB
	destroy : (req, res) => {
		// Do the magic
		const sinEliminado = products.filter((p) => p.id !== +req.params.id);
	
		//if (sinEliminado.length < products.length) {
			fs.writeFileSync(productsFilePath, JSON.stringify(sinEliminado), 'utf-8');
		//}
		return res.redirect('/');
	}
};

module.exports = controller;