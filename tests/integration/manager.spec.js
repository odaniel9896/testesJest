//SUBIR O SERVIDOR NO SUPERTEST
//CRIAR VARIAVEL DE AMBIENTE PARA RODAR O DATABASE DE slowTestThreshold


const request = require("supertest")

const app = require("../../src/app")

const connection = require("../../src/database")
const { cpf } = require("cpf-cnpj-validator")
const truncate = require("./truncate");

describe("MANAGERS", () => {
    afterAll(() => {
        connection.close();
    });
    beforeEach(async (done) => {
       await truncate(connection.models)
       done();
    })

    it("é possivel criar um novo gerente", async () => {
        const response = await request(app).post("/managers").send({
            name: "O Daniel",
            cpf: cpf.generate(),
            email: "teste@gmail.com",
            cellphone: "5519998208012",
            password: "123456",
        });
        expect(response.ok).toBeTruthy();
        expect(response.body).toHaveProperty("id");
    });

    it("Não é possivel cadastrar um gerente com cpf existente", async () => {
        let cpfGerente = cpf.generate();
        let response = await request(app).post("/managers").send({
            name: "O Daniel",
            cpf: cpfGerente,
            email: "testeeee@gmail.com",
            cellphone: "55199982585",
            password: "123456",
        });

        response = await request(app).post("/managers").send({
            name: "O Daniel",
            cpf: cpfGerente,
            email: "adsadsadsad@gmail.com",
            cellphone: "5519559982585",
            password: "123456",
        });

        expect(response.ok).toBeFalsy();
        expect(response.body).toHaveProperty("error");
        expect(response.body.error).toEqual("cpf already exists")

    })
})