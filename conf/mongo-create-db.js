
// Mongoshell script to create an empty profiles db

db = connect('127.0.0.1:27017/blog-system');
db.dropDatabase();
db = connect('127.0.0.1:27017/blog-system');
db.createCollection('posts');
db.profiles.createIndex({'id': 1}, {unique: true});
db.createCollection('sequences');
db.sequences.insertOne({
    name: 'post_id',
    value: 3
});
db.posts.insertOne({
    "id": 1,
    "titulo": "Vacina não é 'elixir mágico' nem substitui prevenção, dizem médicos de SP",
    "local": "Santo Andre,  SP",
    "autor": "joaosilva",
    "data": "01/12/2020",
    "conteudo": "Agora que a vacina está aí quase chegando, estou percebendo a diminuição de todos aqueles cuidados que tinha no início da pandemia. Acho que as pessoas vão chegando num ponto de fadiga, de não conseguir manter todo aquele nível de atenção e cuidado do começo....",
    "capa": "cover_1.jpg",
})
db.posts.insertOne({
    "id": 2,
    "titulo": "Vacina de Oxford será testada em uso combinado com a russa Sputnik V...",
    "local": "Sao Paulo,  SP",
    "autor": "marinaamadeus",
    "data": "02/12/2020",
    "conteudo": "O laboratório sueco AstraZeneca, que desenvolve uma vacina em parceria com a Universidade de Oxford, e a Rússia anunciaram hoje (11) testes clínicos conjuntos que combinam seus dois imunizantes contra o novo coronavírus....",
    "capa": "cover_2.png",
})
db.createCollection('authors');
 db.authors.createIndex({'id': 1}, {unique: true});
 db.authors.createIndex({'username': 1}, {unique: true});
 db.authors.insertOne({
     id: 1,
     username: 'joaosilva',
     fullname: 'Joao Silva',
    //  password: 'joaosilva123'
    password: '$2b$10$oo6lVYVvSyFwqINxFS2.mumM9lIDBrn29hkhoP5ZWF6A2p9DHRiXK'
 });
 db.authors.insertOne({
    id: 2,
    username: 'marinaamadeus',
    fullname: 'Marina Amadeus',
   //  password: 'marina123'
   password: '$2b$10$16r9QhMXpK7AytCUvU8VC.KtWHtV/9INh/ErAY6rLy5MrHjo/Sq4a'
});






