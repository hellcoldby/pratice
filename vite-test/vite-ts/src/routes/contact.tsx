import { Form, useLoaderData, useFetcher} from "react-router-dom";

interface CONTACT_TYPE{
  [props:string]:any;
}

export default function Contact() {
  const { contact } = useLoaderData();
  // console.log(contact);
  // const contact: CONTACT_TYPE = {
  //   first: "Your",
  //   last: "Name",
  //   avatar: "https://placekitten.com/g/200/200",
  //   twitter: "your_handle",
  //   notes: "Some notes",                                                             
  //   favorite: true,
  // };

  return (
    <div id="contact">
      <div>
        <img
          key={contact.avatar}
          src={contact.avatar || undefined}
        />
      </div>

      <div>
        <h1>
          {contact.first || contact.last ? (
            <>
              {contact.first} {contact.last}
            </>
          ) : (
            <i>No Name</i>
          )}{" "}
          <Favorite contact={contact} />
        </h1>

        {contact.twitter && (
            <p>
                <a
                target="_blank"
                href={`https://twitter.com/${contact.twitter}`}
                rel="noreferrer"
                >
                {contact.twitter}
                </a>
            </p>
        )}

        {contact.notes && <p>{contact.notes}</p>}

        <div>
          <Form action="edit">
            <button type="submit">Edit</button>
          </Form>
          <Form
            method="post"
            action="destroy"
            onSubmit={(event) => {
              if (
                !confirm(
                  "Please confirm you want to delete this record."
                )
              ) {
                event.preventDefault();
              }
            }}
          >
            <button type="submit">Delete</button>
          </Form>
        </div>
      </div>
    </div>
  );
}

function Favorite({ contact }:{contact:CONTACT_TYPE}) {
  // yes, this is a `let` for later
  const fetcher = useFetcher();
  let favorite:any = contact.favorite;
  if (fetcher.formData) {
    favorite = fetcher.formData.get("favorite") === "true";
  }
  // console.log(favorite);

  return (
    <fetcher.Form method="post">
      <button
        name="favorite"
        value={favorite ? "false" : "true"}
        aria-label={
          favorite
            ? "Remove from favorites"
            : "Add to favorites"
        }
      >
        {favorite ? "★" : "☆"}
      </button>
    </fetcher.Form>
  );
}