import GridClient from './components/gridClient';

const IndexPage = () => {
  const handleWeightChange = ({ position, weight }) => {
    console.log(`Square (${row}, ${col}): Weight ${weight}`);
    // Adicione lógica para armazenar ou processar os pesos conforme necessário
  };

  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">Route Assessment</h1>
      <GridClient onWeightChange={handleWeightChange} />
    </div>
  );
};

export default IndexPage;