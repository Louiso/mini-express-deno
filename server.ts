import { serve } from "https://deno.land/std/http/server.ts";

interface Endpoint {
  path: string,
  callbacks: ((req,res,next) => void)[]
}

interface Config {
  port: number,
  gets: Array<Endpoint>,
  posts: Array<Endpoint>
}

class Express {
  config: Config;
  
  constructor(){
    this.config = {gets:[], posts:[], port: 8000}
  }
  get(path, ...callbacks){
    this.config.gets.push({
      path,
      callbacks
    })
  }
  post(path, ...callbacks){
    this.config.gets.push({
      path,
      callbacks
    })
  }
  async listen(port,callback) {
    this.config.port = port
    const s = serve(`0.0.0.0:${this.config.port}`)
    callback()
    for await (const req of s) {
      // const res = new Res(req)
      const {url, method} = req
      try{
        switch(method){
          case 'GET': {
            const get = this.config.gets.find(({path}) => path === url)
            if(!get) throw new Error('GET NOT FOUND')
            const { callbacks } = get
            for(let i = 0 ; i < callbacks.length ; i++){
              let hasNext = false
              const next = () => {
                hasNext = true 
              }
              callbacks[i]({params: {id: 1}},{},next)
              if(!hasNext) break
            }
            break;
          }
          case 'POST': {
            const post = this.config.posts.find(({path}) => path === url)
            if(!post) throw new Error('GET NOT FOUND')
            console.log(post)            
            break;
          }
          default: {
            break;
          }
        }
      }catch(err){
        console.log(err)
      }
    }
  }
}

const data = {
  message: 'Hola Mundo',
  alumnos: [{
    _id: 1,
    alumno: 'Luis Alfredo'
  },{
    _id: 2,
    alumno: 'Jose Armando'
  }]
}

class Res {
  req: any;
  constructor(req) {
    this.req = req
  }
  json(data){
    this.req.respond({ body: new TextEncoder().encode(JSON.stringify(data)) });
  }
  text(data){
    this.req.respond({ body: new TextEncoder().encode(data)});
  }
}

const app = new Express()

const middleware = (req,res,next) => {
  const {params : { id}} = req
  console.log('id' , id)
}

const controller = (req,res) => {
  console.log('callback')
}

app.get('/api',middleware,controller)

app.listen(3000, () => {
  console.log(`Server running on port: ${3000}`)
})