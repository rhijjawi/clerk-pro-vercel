"use client";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { KeyIcon } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import { useKeyProvider } from "./key-provider";

export default function Key() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { setKey } = useKeyProvider();
  const [newKey, setNewKey] = useState<undefined | string>();
  const [keyValid, setKeyValid] = useState(false);
  useEffect(() => {
    setKeyValid(
      !(typeof newKey == "undefined") &&
        (newKey?.startsWith("sk_live_") || newKey?.startsWith("sk_test_")),
    );
  }, [newKey]);
  return (
    <>
      <Dialog.Root
        open={isOpen}
        onOpenChange={(open) => {
          if (!open) {
            if (keyValid) {
              setKey(newKey);
              return setIsOpen(false);
            }
          }
          setIsOpen(open);
        }}>
        <Dialog.Trigger>
          <Button onClick={() => setIsOpen(true)} variant='outline' size='icon'>
            <KeyIcon className={"h-[1.2rem] w-[1.2rem]"} />
          </Button>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className='fixed inset-0 top-0 z-[60] bg-black/30' />
          <Dialog.Content className='fixed left-[50%] top-[50%] z-[70] max-h-[85vh] w-[50vw] translate-x-[-50%] translate-y-[-50%] rounded-md bg-white p-6 outline dark:bg-black dark:outline-white'>
            <Dialog.Title className='DialogTitle'>Set Key</Dialog.Title>
            <Dialog.Description className='mb-[20px] mt-[10px] text-slate-400'>
              This key is only used to create requests to the Clerk API and is
              NEVER saved.
            </Dialog.Description>
            <label
              htmlFor='password'
              className='mb-2 block text-sm font-medium text-gray-900 dark:text-white'>
              Clerk Secret (sk_live_.... / sk_test_....)
            </label>
            <input
              autoComplete='off'
              onChange={(e) => setNewKey(e.target.value)}
              type='password'
              id='password'
              className='block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500'
              placeholder='sk_live_••••••••••••••••••'
              required
            />
            {!keyValid && (
              <p className='font-xs translate-y-2 text-red-500'>
                The provided key is invalid.
              </p>
            )}
            <div
              style={{
                display: "flex",
                marginTop: 25,
                justifyContent: "flex-end",
              }}>
              <Dialog.Close asChild>
                <Button disabled={!keyValid}>Save changes</Button>
              </Dialog.Close>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
