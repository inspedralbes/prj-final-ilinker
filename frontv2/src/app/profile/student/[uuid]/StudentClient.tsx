'use client'

import StundentClientMe from './StudentClientMe';
import StundentClientNotMe from './StudentClientNotMe';
import { useEffect, useState } from 'react';

interface StudentClientProps {
    uuid: string;
    student: object;
    experience_group: object;
}

export default function StudentClient({ uuid, student, experience_group }: StudentClientProps) {
    const [myStudent, setMyStudent] = useState<boolean>(false);

    useEffect(() => {
        setMyStudent(true);
    }, []);

    return (
        <div>
            {myStudent ? (
                <StundentClientMe uuid={uuid} student={student} experience_group={experience_group} />
            ) : (
                <StundentClientNotMe student={student} />
            )}
        </div>
    );
}
