'use client'
import { apiRequest } from '@/services/requests/apiRequest';
import { useEffect } from 'react';
import { useContext } from 'react';
import { LoaderContext } from '@/contexts/LoaderContext';
import { toast } from '@/hooks/use-toast';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { DialogHeader } from '@/components/ui/dialog';

export default function QuestionsPage() {
    const router = useRouter();
    const { showLoader, hideLoader } = useContext(LoaderContext);
    const [questions, setQuestions] = useState<any[]>([]);
    const [search, setSearch] = useState('');
    const fetchQuestions = async () => {
        showLoader();
        try {
            const data = await apiRequest('admin/questions', 'GET');
            console.log(data);
            setQuestions(data?.data || []);
        } catch (error) {
            toast({
                title: 'Error',
                description: error instanceof Error ? error.message : 'Error al cargar preguntas',
                variant: 'destructive',
            });
        } finally {
            hideLoader();
        }
    };

    useEffect(() => {
        fetchQuestions();
    }, []);

    const [contentAnswer, setContentAnswer] = useState('');
    const getNameByRole = (user: any) => {
        switch (user.rol) {
            case 'company':
                return user.company.name;
            case 'institutions':
                return user.institution.name;
            case 'student':
                return user.student.name;
            default:
                return 'No data';
        }
    }

    const handleResponse = (questionId: number) => {
        showLoader();
        apiRequest(`admin/response-question`, 'POST', {
            answer: contentAnswer,
            question_id: questionId
        })
            .then((response) => {
                console.log(response);
                toast({
                    title: 'Respuesta enviada',
                    description: 'La respuesta se envio correctamente',
                    variant: 'default',
                });
                setContentAnswer('');
                fetchQuestions();
            })
            .catch((error) => {
                toast({
                    title: 'Error',
                    description: error instanceof Error ? error.message : 'Error al enviar la respuesta',
                    variant: 'destructive',
                });
            })
            .finally(() => {
                hideLoader();
            });
    }
    const [modalAnswerQuestion, setModalAnswerQuestion] = useState(false);
    const [viewQuestionData, setViewQuestionData] = useState<any>(null);
    const openModal = (question: any) => {
        setModalAnswerQuestion(true);
        setViewQuestionData(question);
    }

    const getFormattedLabel = (label: string) => {
        switch (label) {
            case 'account':
                return 'Problemas de cuenta';
            case 'bug':
                return 'Reportar un error';
            case 'feature':
                return 'Solicitud de característica';
            case 'other':
                return 'Otro';
            default:
                return 'No data';
        }
    }
    return (
        <>
            <div className="p-6 space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 w-full">
                    <div className="flex items-center gap-4">
                        <div>
                            <h1 className="text-2xl font-bold">Preguntas</h1>
                            <p className="text-sm text-muted-foreground">
                                {questions.length} preguntas registradas
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2 items-end sm:items-center">
                        <div className="relative w-full sm:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Buscar preguntas..."
                                className="pl-9 w-full"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>

                        <Button onClick={() => router.push("/admin")} className="w-full sm:w-auto">
                            Ir al panel de admin
                        </Button>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {questions.map((question) => (
                        <div
                            key={question.id}
                            className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
                        >
                            <div className="flex items-center justify-between mb-2">
                                <h2 className="text-lg font-semibold">{getFormattedLabel(question.subject)}</h2>
                                <p className="text-sm text-gray-500">{getNameByRole(question.user)}</p>
                            </div>
                            <p className="text-sm text-gray-600">{question.message}</p>
                            <div className="flex items-center justify-between mt-4">
                                <p className="text-sm text-gray-500">
                                    {formatDistanceToNow(new Date(question.created_at), { locale: es })}
                                </p>
                                {/* Acciones */}
                                <Button
                                    variant="outline"
                                    onClick={() => openModal(question)}
                                >
                                    Responder pregunta
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
                {questions.length === 0 && (
                    <p className="text-center text-gray-500">No hay preguntas registradas</p>
                )}
            </div>
           
           {modalAnswerQuestion && (
            <div>
                <Dialog open={modalAnswerQuestion} onOpenChange={setModalAnswerQuestion}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Responder pregunta</DialogTitle>
                            <DialogDescription>
                                Responde la pregunta de {getNameByRole(viewQuestionData.user)}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="mt-4">
                            <Textarea
                                placeholder="Escribe tu respuesta"
                                value={contentAnswer}
                                onChange={(e) => setContentAnswer(e.target.value)}
                            />
                        </div>
                        <div className="flex justify-end mt-4">
                            <Button
                                onClick={() => handleResponse(viewQuestionData.id)}
                                disabled={!contentAnswer}
                            >
                                Enviar respuesta
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
           )}
        </>
    );
}