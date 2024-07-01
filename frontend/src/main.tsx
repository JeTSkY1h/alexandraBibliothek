import React from 'react'
import ReactDOM from 'react-dom/client'
import { ChakraProvider } from '@chakra-ui/react'
import { theme } from './theme/chakra-custom-theme.tsx'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'


ReactDOM.createRoot(document.getElementById('root')!).render(
  
    <BrowserRouter>
      <ChakraProvider theme={theme}>
        <App/>
      </ChakraProvider>
    </BrowserRouter>
  
)
