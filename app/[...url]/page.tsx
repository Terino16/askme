import { ragChat } from '@/lib/rag-chat'
import { redis } from '@/lib/redis'
import React from 'react'
import ChatWrapper from '../components/ChatWrapper'


type PageProps = {
   params:{
    url:string | undefined | string[]
   }
}

const reconstructUrl=({url}:{url:string[]})=>{
    const decodedURL =url.map((component)=>decodeURIComponent(component))
    return decodedURL.join("/");
}

const Page = async({params}: PageProps) => 
    {
     const constructedURL=reconstructUrl({url:params.url as string[]});
     const sessionId="Monsterverser"
     const isAlreadyIndexed=await redis.sismember("indexed-urls",constructedURL);
     console.log("IsAlreadyIndexed",isAlreadyIndexed);

     if(!isAlreadyIndexed)
     {
      await ragChat.context.add({
         type:"html",
         source:constructedURL,
         config: { chunkOverlap: 50, chunkSize: 200 },
      })

      await redis.sadd("indexed-urls",constructedURL);
     }

  
     return <ChatWrapper sessionId={sessionId}/>
}

export default Page