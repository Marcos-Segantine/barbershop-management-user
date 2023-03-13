import firestore from '@react-native-firebase/firestore';

export const handleFeedback = async (
    feedback,
    setFeedback,
    setModalVisible,
    userData,
    setSomethingWrong
) => {
    try {
        if (!feedback.trim()) {
            setModalVisible(true);
            setMessageError('Por favor, preencha o campo de feedback.');
            return;
        }

        const feedbackRef = firestore().collection('feedbacks').doc(userData.uid);
        const feedbackDoc = await feedbackRef.get();
        const feedbackData = feedbackDoc.exists
            ? feedbackDoc.data()
            : { feedbacks: [] };
        const updatedFeedbacks = [...feedbackData.feedbacks, feedback];

        await feedbackRef.set({ feedbacks: updatedFeedbacks });

        setModalVisible(true);
        setMessageError('Obrigado por compartilhar o seu feedback!');

        setFeedback('');
    } catch (error) {
        console.log('Erro ao enviar feedback: ', error);
        setSomethingWrong(true)
    }
};
