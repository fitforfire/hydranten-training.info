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
                </div>
            </div>
        </>
    )
}