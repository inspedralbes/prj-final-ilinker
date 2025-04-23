'use client'

import StundentClientMe from './StudentClientMe';
import StundentClientNotMe from './StudentClientNotMe';
import { useEffect, useState } from 'react';

interface StudentClientProps {
    uuid: string;
    student: object;
}

export default function StudentClient({ uuid, student }: StudentClientProps) {
    const [myStudent, setMyStudent] = useState<boolean>(false);

    useEffect(() => {
        setMyStudent(true);
    }, []);

    return (
        <div>
            {myStudent ? (
                <StundentClientMe uuid={uuid} student={student} />
            ) : (
                <StundentClientNotMe student={student} />
            )}
        </div>
    );
}
