import React,{useEffect,useState} from 'react';
import {firebase} from './firebase';


function App() {
  
  const [tarefas, setTarefas] = useState([]);
  const [tarefa, setTarefa] = useState('');
  const [modoEdicao,setModoEdicao] = useState(false);
  const [id, setId] = useState('');
  
  
  useEffect(() => {

    //Listando dados
    const obterDados = async () => {

        try 
        {        
            const db = firebase.firestore();
            const data = await db.collection('tarefas').get();          
            const arrayDados = await data.docs.map(doc => ({id:doc.id,...doc.data()}))
            console.log(arrayDados);
            setTarefas(arrayDados);
            
        } catch (error) {
            console.log(error)
        }  
        
      }
   

      obterDados()
  },[]);


  //Criando no Banco de Dados
  const agregar = async (e) => {
    e.preventDefault();

    if(!tarefa.trim()){
      console.log('Esta vazio');
      return
    }

    try {
        //Abrindo banco de dados
        const db = firebase.firestore();

        //criando objeto
        const novaTarefa = {
          name:tarefa,
          fecha: Date.now()
        }

        //adicionando ao banco de dados
        const data = await db.collection('tarefas').add(novaTarefa);

        //Adicionando tarefa na tela..
        setTarefas([
            ...tarefas,
            {...novaTarefa,id: data.id}      

          ])      

        //Resetando campo
        setTarefa('');

    } catch (error) {

      console.log(error);
    }
    
    console.log(tarefa)
  }


  //Deletando do banco de dados
  const eliminar = async (id) => {

    try {
      const db = firebase.firestore();
      await db.collection('tarefas').doc(id).delete();

      //atualizar e remover da tela
      const arrayFiltrado = tarefas.filter(item => item.id !== id);
      setTarefas(arrayFiltrado);



    } catch (error) {
      console.log(error);
      
    }

  }


  //Modo edição
  const ativarEdicao = (item) => {
    setModoEdicao(true);
    setTarefa(item.name);
    setId(item.id);
  }

  const editar = async (e) => {
    e.preventDefault();

    //Se estiver vazio, retorna
    if(!tarefa.trim()){
      console.log('Vazio');
      return;
    }

    //Atualizando no banco de dados
    try {

      const db = firebase.firestore();

        //Atualizando
        await db.collection('tarefas').doc(id).update({
          name:tarefa
        })


        const arrayEditado = tarefas.map(item => (
          item.id === id ? {id: item.id, fecha: item.fecha,name: tarefa} : item
        ))

        setTarefas(arrayEditado);

        //Resetar
        setModoEdicao(false);
        setTarefa('');
        setId('');
    } catch (error) {
      console.log(error);
    }
  }



return (
    <div className="container mt-3">
      <div className="row">
        <div className="col-md-6">
        <h3 className="text-center text-uppercase">Tarefas</h3>
            <ul className="list-group">
            {
              tarefas.map(item => (
                <li className="list-group-item text-center text-uppercase " key={item.id}>
                  {item.name}
                  <button 
                        className="btn btn-danger btn-sm float-right"
                        onClick={() => eliminar(item.id)}
                        >                
                    Eliminar                  
                  </button>

                  <button 
                        className="btn btn-warning btn-sm float-right mr-2"
                        onClick={() => ativarEdicao(item)}
                        
                        
                        >                
                    Editar                 
                  </button>
                </li>

              ))

            }
            
            </ul>

        </div>

        <div className="col-md-6">
          <h3 className="text-center text-uppercase mt-5">

            {
              modoEdicao ? 'Editar Tarefa' : 'Adicionar Tarefa'

            }

          </h3>

          <form
              onSubmit={modoEdicao ? editar : agregar}              
          >
              <input
                  type="text"
                  placeholder="informe a tarefa"
                  className="form-control mb-2"
                  onChange={e => setTarefa(e.target.value)}
                  value={tarefa}
              />

              {
                modoEdicao ? (
                  <button 
                     className="btn btn-warning btn-block">
                      Editar Tarefa
                 </button> 

                ) : (
                  <button 
                     className="btn btn-primary btn-block">
                      Inserir Tarefa
                 </button> 
                 
                )


              }         
          
          </form>
        </div>
      
      </div>
    
    </div>
  );
}

export default App;
