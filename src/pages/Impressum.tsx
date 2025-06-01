import { Navbar } from "@/components/Navbar"

export default function Impressum(){

    return (
        <>
            <Navbar/>
            <div className="m-auto w-full h-[80%] items-center flex justify-center p-4">
                <div className="w-[400px] h-[200px]">
                    <strong><p>Impressum:</p></strong>
                    <br></br>
                    <p>Inhaber und Betreiber der Webseite:</p>
                    <br></br>
                    <p>Non-Profit Projekt</p>
                    <br></br>
                    <p>Florian Bischof</p>
                    <p>Lerchenstraße 4</p>
                    <p>6922 Wolfurt</p>
                    <p><a href="mailto:help@lagekarte.info" className="hover:underline">help@lagekarte.info</a></p>
                    <br></br>
                    <br></br>
                    <br></br>
                    <p><a className="hover:underline" target="_blank" href="https://www.flaticon.com/de/kostenloses-icon/feuerhydrant_394616">Hydranten Icon made by Freepik from www.flaticon.com</a></p>
                </div>
            </div>
        </>
    )
}