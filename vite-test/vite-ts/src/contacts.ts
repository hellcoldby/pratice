import localforage from "localforage";
import { matchSorter } from "match-sorter";
import sortBy from "sort-by";

export async function getContacts(query?:any) {
  await fakeNetwork(`getContacts:${query}`);
  // localforge 返回的是对象数组{id:string; createAt:number;}
  let contacts:any[]|null= await localforage.getItem("contacts");
  if (!contacts) contacts = [];
  if (query) {
    contacts  = matchSorter(contacts as any[], query, { keys: ["first", "last"] });
  }
  return contacts.sort(sortBy("last", "createdAt"));
}

export async function createContact() {
  await fakeNetwork();
  const id = Math.random().toString(36).substring(2, 9);
  const contact = { id, createdAt: Date.now() };
  // getContants 返回的是对象数组{id:string; createAt:number;}
  const contacts:any[] = await getContacts();
  contacts.unshift(contact);
  await set(contacts);
  return contact;
}

export async function getContact(id:string) {
  await fakeNetwork(`contact:${id}`);
  const contacts:any[]|null = await localforage.getItem("contacts");
  if(!contacts) return null;
  const contact = contacts.find(contact => contact.id === id);
  return contact ?? null;
}

export async function updateContact(id:string, updates) {
  console.log(updates);
  await fakeNetwork();
  const contacts:any[]|null = await localforage.getItem("contacts");
  if (!contacts) throw new Error("No contact found for"+id);
  const contact = contacts.find(contact => contact.id === id);
  Object.assign(contact, updates);
  await set(contacts);
  return contact;
}

export async function deleteContact(id) {
  let contacts = await localforage.getItem("contacts");
  let index = contacts.findIndex(contact => contact.id === id);
  if (index > -1) {
    contacts.splice(index, 1);
    await set(contacts);
    return true;
  }
  return false;
}

function set(contacts) {
  return localforage.setItem("contacts", contacts);
}

// fake a cache so we don't slow down stuff we've already seen
let fakeCache:{[props:string]:any} = {};

async function fakeNetwork(key?:string) {
  if (!key) {
    fakeCache = {};
  }

  if (fakeCache[key]) {
    return;
  }

  fakeCache[key] = true;
  return new Promise(res => {
    setTimeout(res, Math.random() * 1500);
  });
}