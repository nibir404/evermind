"use client";
import { Modal } from "./demo-ui";
export function Confirm({open,title,body,confirmLabel="Delete",danger=true,onConfirm,onCancel}:{open:boolean;title:string;body?:string;confirmLabel?:string;danger?:boolean;onConfirm:()=>void;onCancel:()=>void}){return open?<Modal title={title} onClose={onCancel}><p>{body}</p><div className="demo-actions"><button autoFocus className="demo-button" onClick={onCancel}>Cancel</button><button className={`demo-button ${danger?"danger":"primary"}`} onClick={onConfirm}>{confirmLabel}</button></div></Modal>:null;}
