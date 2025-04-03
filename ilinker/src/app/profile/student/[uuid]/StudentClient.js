"use client"

import StundentClientMe from './StudentClientMe';
import StundentClientNotMe from './StudentClientNotMe';
import {useEffect, useState} from "react";

export default function StudentClient({uuid, student}) {

    const [myStudent, setMyStudent] = useState(false);

    useEffect(() => {
        setMyStudent(true);
    });

    return (
        <div>
            {myStudent ? (
                <StundentClientMe student={student}/>
            ) : (
                <StundentClientNotMe student={student}/>
            )}
        </div>
    )

}