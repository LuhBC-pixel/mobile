import { useRoute } from '@react-navigation/native';
import { useToast, VStack } from 'native-base';
import { useEffect, useState } from 'react';
import { EmptyMyPoolList } from '../components/EmptyMyPoolList';
import { Header } from '../components/Header';
import { Loading } from '../components/Loading';
import { PoolCardProps } from '../components/PoolCard';
import { PoolHeader } from '../components/PoolHeader';
import { api } from '../services/api';

interface RouteParams {
  id: string;
}

// {"_count": {"participants": 2}, "code": "BOL123", "createdAt": "2022-11-03T01:19:40.863Z", "id": "cla0drcxq0003w2ajekaxfqy2", "owner": {"id": "cla0drcxl0000w2aj17cjo6og", "name": "John Doe"}, "ownerId": "cla0drcxl0000w2aj17cjo6og", "participants": [{"id": "cla0drcxq0004w2aj4yl2bacq", "user": [Object]}, {"id": "cla4nv60m0004w21q884654al", "user": [Object]}], "title": "Example Pool"}

export function Details() {
  const [poolDetails, setPoolDetails] = useState<PoolCardProps>(
    {} as PoolCardProps
  );
  const [isLoading, setIsLoading] = useState(false);

  const route = useRoute();
  const { id } = route.params as RouteParams;
  const toast = useToast();

  async function fetchPoolDetails() {
    try {
      setIsLoading(true);

      const response = await api.get(`/pools/${id}`);
      setPoolDetails(response.data.pool);
    } catch (error) {
      console.log(error);
      toast.show({
        title: 'Não foi possível carregar os detalhes do bolão',
        placement: 'top',
        bgColor: 'red.500',
      });
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchPoolDetails();
  }, [id]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <VStack flex={1} bgColor='gray.900'>
      <Header title={poolDetails.title} showBackButton showShareButton />

      {poolDetails._count?.participants > 0 ? (
        <VStack px={5} flex={1}>
          <PoolHeader data={poolDetails} />
        </VStack>
      ) : (
        <EmptyMyPoolList code={poolDetails.code} />
      )}
    </VStack>
  );
}
