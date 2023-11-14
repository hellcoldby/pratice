import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider, redirect } from 'react-router-dom'
import './index.css'
import ErrorPage from './error-page'
import Contact  from "./routes/contact";
import Root from './routes/root'
import EditContact from "./routes/edit";
import { getContacts, createContact, getContact, updateContact, deleteContact   } from "./contacts";
import Index from "./routes/index";

const router = createBrowserRouter([
  {
    path:'/',
    element:<Root/>,
    errorElement:<ErrorPage/>,
    loader: async({request})=>{
      const url = new URL(request.url);
      const q = url.searchParams.get("q");
      const contacts = await getContacts(q);
      return { contacts,};
    },
    action:async()=>{
      const contact = await createContact();
      return redirect(`/contacts/${contact.id}/edit`);
      // return { contact };
    },
    children: [
      { index: true, element: <Index /> },
      {
        path: "contacts/:contactId",
        element: <Contact />,
        loader: async(match)=>{
          const {params} = match;
          // console.log(match);
          const contact = await getContact(params.contactId);

          // console.log(contact);
          return { contact };
        },
        action: async({ request, params })=>{
          const formData = await request.formData();
          return updateContact(params.contactId, {
            favorite: formData.get("favorite") === "true",
          });
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
      },
      {
        path:'contacts/:contactId/destroy',
        action:async({params}) => {
          await deleteContact(params.contactId);
          return redirect('/'); 
        },
        errorElement: <div>Oops! There was an error.</div>,
      }
    ]
  },
])

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
      <RouterProvider router={router}/>
  </React.StrictMode>
)
