"use client"
import { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import { KeyIcon } from "lucide-react";
import * as Dialog from '@radix-ui/react-dialog';
import { useRouter } from "next/navigation";
import { useKeyProvider } from "./key-provider";

export default function Key(){
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const {key, setKey} = useKeyProvider()
    const [newKey, setNewKey] = useState<undefined|string>()
    const [keyValid, setKeyValid] = useState(false)
    const inputRef = useRef("")
    const router = useRouter()
    useEffect(()=>{
        setKeyValid((!(typeof newKey == "undefined") && (newKey?.startsWith("sk_live_") || newKey?.startsWith("sk_test_"))))
    }, [newKey])
    return (<>
        <Dialog.Root open={isOpen} onOpenChange={(open)=>{
            if (!open){
                if (keyValid){
                    setKey(newKey)
                    return setIsOpen(false)
                }
            }
            setIsOpen(open)
            }}>
            <Dialog.Trigger><Button onClick={()=>setIsOpen(true)} variant='outline' size='icon'><KeyIcon className={"h-[1.2rem] w-[1.2rem]"}/></Button></Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className="bg-black/30 inset-0 fixed z-[60] top-0"/>
                <Dialog.Content className="bg-white dark:bg-black outline dark:outline-white w-[50vw] max-h-[85vh] z-[70] rounded-md fixed p-6 top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
                    <Dialog.Title className="DialogTitle">Set Key</Dialog.Title>
                    <Dialog.Description className="text-slate-400 mt-[10px] mb-[20px]">
                        This key is only used to create requests to the Clerk API and is NEVER saved.
                    </Dialog.Description>
                        <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Clerk Secret (sk_live_.... / sk_test_....)</label>
                        <input autoComplete='off' onChange={(e) => setNewKey(e.target.value)} type="password" id="password" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="sk_live_••••••••••••••••••" required />
                        {!keyValid && <p className="font-xs text-red-500 translate-y-2">The provided key is invalid.</p>}
                    <div style={{ display: 'flex', marginTop: 25, justifyContent: 'flex-end' }}>
                        <Dialog.Close asChild>
                            <Button disabled={!keyValid}>Save changes</Button>
                        </Dialog.Close>
                    </div>
                </Dialog.Content>

            </Dialog.Portal>
        </Dialog.Root>
    </>)
}