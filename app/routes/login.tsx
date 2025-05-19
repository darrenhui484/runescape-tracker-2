import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";

type FormErrors = {
  roomId?: string;
  username?: string;
};

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const action = formData.get("action");
  const roomId = formData.get("roomId");
  const username = formData.get("username");

  const errors: FormErrors = {};

  if (!roomId) {
    errors.roomId = "Room ID is required";
  }

  if (!username) {
    errors.username = "Username is required";
  }

  if (Object.keys(errors).length > 0) {
    return Response.json(errors);
  }

  const origin = new URL(request.url).origin;
  let url = new URL(`${origin}/rooms`);
  url.searchParams.set("roomId", roomId as string);
  url.searchParams.set("username", username as string);
  if (action === "join") {
    return redirect(url.toString());
  }
  throw new Error("Should be unreachable");
}

export default function Index() {
  const actionData = useActionData<FormErrors>();
  return <JoinOrCreateRoom errors={actionData} />;
}

function JoinOrCreateRoom({ errors }: { errors?: FormErrors }) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Form
        action="/login"
        method="post"
        className="max-w-md w-full space-y-4 p-6 rounded-lg shadow-md border"
      >
        <div>
          <label htmlFor="roomId" className="block text-sm font-medium">
            Room ID
          </label>
          <input
            type="text"
            name="roomId"
            className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
              errors?.roomId
                ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
            }`}
          />
          {errors?.roomId && (
            <p className="mt-1 text-sm text-red-600">{errors.roomId}</p>
          )}
        </div>
        <div>
          <label htmlFor="username" className="block text-sm font-medium">
            Username
          </label>
          <input
            type="text"
            name="username"
            className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
              errors?.username
                ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
            }`}
          />
          {errors?.username && (
            <p className="mt-1 text-sm text-red-600">{errors.username}</p>
          )}
        </div>
        <div className="flex justify-end space-x-3">
          <button
            type="submit"
            name="action"
            value="join"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Join
          </button>
        </div>
      </Form>
    </div>
  );
}
