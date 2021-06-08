class Despesa {
    constructor(ano,mes,dia,tipo,descricao,valor){
        this.ano = ano 
        this.mes = mes
        this.dia = dia
        this.tipo = tipo
        this.descricao = descricao
        this.valor = valor
    }

    validarDados(){
        for(let i in this){
            if(this[i] == undefined ||this[i] == '' ||this[i] == null ){
                return false
            }
        }
        return true
    }
}

class Bd{
    constructor(){
        let id = localStorage.getItem('id')
        if(id === null){
            localStorage.setItem('id', 0)
        }
    }

    getProximoId(){
        let proximoId = localStorage.getItem('id')
        return parseInt(proximoId) + 1
    }

    gravar(d){
        let id = this.getProximoId()
        localStorage.setItem(id,JSON.stringify(d))
        localStorage.setItem('id', id)
    }

    recuperarTodosRegistros(){
        let despesas = Array()
        let id = localStorage.getItem('id')
        for(let i = 1; i<=id; i++){
            let despesa = JSON.parse(localStorage.getItem(i))
            if(despesa != null){
                despesa.id = i
               despesas.push(despesa) 
            }
        }
        return despesas
    }

    pesquisar(despesa){
        let filtro = Array()
        filtro = this.recuperarTodosRegistros()

        if(despesa.ano!=''){
           filtro = filtro.filter(d => d.ano == despesa.ano) 
        }
        if(despesa.mes!=''){
            filtro = filtro.filter(d => d.mes == despesa.mes) 
        }
        if(despesa.dia!=''){
            filtro = filtro.filter(d => d.dia == despesa.dia) 
        }
        if(despesa.tipo!=''){
            filtro = filtro.filter(d => d.tipo == despesa.tipo) 
        }
        if(despesa.descricao!=''){
            filtro = filtro.filter(d => d.descricao == despesa.descricao) 
        }
        if(despesa.valor!=''){
            filtro = filtro.filter(d => d.valor == despesa.valor) 
        }
        return filtro
    }

    remover(id){
        localStorage.removeItem(id)
    }
}

let bd = new Bd()

function cadastrarDespesa(){
    let ano = document.getElementById('ano')
    let mes = document.getElementById('mes')
    let dia = document.getElementById('dia')
    let tipo = document.getElementById('tipo')
    let descricao = document.getElementById('descricao')
    let valor = document.getElementById('valor')

    let despesa = new Despesa(ano.value,mes.value,dia.value,tipo.value,descricao.value,valor.value)
    
    if(despesa.validarDados()){
        bd.gravar(despesa)

        document.getElementById('modal').className = 'modal-header text-success'
        document.getElementById('modalLabel').innerHTML = 'Sucesso na gravação da despesa'
        document.getElementById('modalBody').innerHTML = 'Registro de despesa realizado com Sucesso!'
        document.getElementById('modalButton').innerHTML = 'Voltar'
        document.getElementById('modalButton').className = 'btn btn-success'
        $(`#registroDespesa`).modal('show')
        //limpar formulario apos inserir com sucesso
        ano.value =''
        mes.value =''
        dia.value =''
        tipo.value =''
        descricao.value =''
        valor.value =''

    }else{

        document.getElementById('modal').className = 'modal-header text-danger'
        document.getElementById('modalLabel').innerHTML = 'Erro na gravação'
        document.getElementById('modalBody').innerHTML = 'Um ou mais elementos obrigatórios estão vazios'
        document.getElementById('modalButton').innerHTML = 'Volatr e corrigir'
        document.getElementById('modalButton').className = 'btn btn-danger'
        $(`#registroDespesa`).modal('show')
    }
 
}

function carregaListaDespesa(despesas = Array(),filtro = false){

    if(despesas.length == 0 && filtro == false){
       despesas = bd.recuperarTodosRegistros() 
    }

    
    //mostrar na tabela de consulta.html
    let tabela = document.getElementById('tabelaDespesa')
    tabela.innerHTML =''

    despesas.forEach(function(d){
       let linha = tabela.insertRow()
       //colunas: data-0,tipo-1,descrição-2 e valor-3
       linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}`
       
       switch(d.tipo){
            case '1':
                d.tipo = 'Alimentação'
                break
            case '2':
                d.tipo = 'Educação'
                break
            case '3':
                d.tipo = 'Lazer'
                break
            case '4':
                d.tipo = 'Saúde'
                break
            case '5':
                d.tipo = 'Transporte'
                break
       }
       linha.insertCell(1).innerHTML = d.tipo
       linha.insertCell(2).innerHTML = d.descricao
       linha.insertCell(3).innerHTML = d.valor

       let btn = document.createElement('button')
       btn.className = 'btn btn-danger'
       btn.innerHTML = '<i class="fas fa-times"></i>'
       btn.id = `id_despesa_${d.id}`
       btn.onclick = function(){
           let id = this.id.replace('id_despesa_', '')
           bd.remover(id)

           window.location.reload()
       }
       linha.insertCell(4).append(btn)
       
    })
}

function pesquisarDespesa(){

    let ano = document.getElementById('ano')
    let mes = document.getElementById('mes')
    let dia = document.getElementById('dia')
    let tipo = document.getElementById('tipo')
    let descricao = document.getElementById('descricao')
    let valor = document.getElementById('valor')

    let despesa = new Despesa(ano.value,mes.value,dia.value,tipo.value,descricao.value,valor.value)
    let despesas = bd.pesquisar(despesa)

    carregaListaDespesa(despesas,true)

}

