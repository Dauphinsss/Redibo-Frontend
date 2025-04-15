import Image from 'next/image';

export default function Autoimag(){
  return(
      <section className="max-w-3xl">
          <h2 className="text-xl sm:text-2xl font-bold mb-4">Toyota Corolla</h2>
          
          <div className="flex flex-col lg:flex-row-reverse gap-2">

              <img
                  src="/ejemplo.jpg"
                  alt="Auto principal"
                  className="w-full lg:w-2/3 rounded-lg object-cover"
              />
              
              <div className="hidden lg:flex flex-col gap-2 w-1/3">
                  <img 
                      src="/ejemplo1.jpg" 
                      alt="Auto1" 
                      className="rounded-lg object-cover h-1/2"
                  />
                  <img 
                      src="/ejemplo2.jpg" 
                      alt="Auto2" 
                      className="rounded-lg object-cover h-1/2"
                  />
              </div>
          </div>
      </section>         
  )
}