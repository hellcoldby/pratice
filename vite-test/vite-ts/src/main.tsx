import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider, redirect } from 'react-router-dom'
import './index.css'
import ErrorPage from './error-page'
import Contact  from "./routes/contact";
import Root from './routes/root'
import EditContact from "./routes/edit";
import { getContacts, createContact, getContact, updateContact  } from "./contacts";

export async function action() {
  const contact = await createContact();
  return { contact };
}


const router = createBrowserRouter([
  {
    path:'/',
    element:<Root/>,
    errorElement:<ErrorPage/>,
    loader: async()=>{
      const contacts = await getContacts();
      return { contacts };
    },
    action,
    children: [
      {
        path: "contacts/:contactId",
        element: <Contact />,
        loader: async(match)=>{
          const {params} = match;
          console.log(params, match);
          const contact = await getContact(params.contactId);
          // console.log(contact);
          return { contact };
        }
      },
      {
        path: "contacts/:contactId/edit",
        element: <EditContact />,
        loader: async({params})=>{
          const contact = await getContact(params.contactId);
          return {contact}
        },
        action: async({request, params})=>{
          console.log(request);
          const formData = await request.formData();
          const updates = Object.fromEntries(formData);
          await updateContact(params.contactId, updates)
          return redirect(`/contacts/${params.contactId}`);
        }
      }
    ]
  },
])

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
      <RouterProvider router={router}/>
  </React.StrictMode>
)
