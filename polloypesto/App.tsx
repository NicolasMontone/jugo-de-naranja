import { useEffect, useState } from 'react';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { StyleSheet, View, Button, Text, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';

type Supply = {
  id: string;
  product_name: string;
  quantity: number;
  created_at: string;
};

const exampleSupplies: Supply[] = [
  {
    product_name: 'Jorgito',
    quantity: 1,
    id: '123',
    created_at: '2021-06-01T00:00:00.000Z',
  },
];

export default function App() {
  const [scanning, setScanning] = useState(false);
  const [supplies, setSupplies] = useState<Supply[]>(exampleSupplies);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getBarCodeScannerPermissions();
  }, []);
  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    setScanned(true);
    try {
      const productResponse = await fetch(
        `https://pollo-y-pesto-nicolasmontone.vercel.app/api/products/${data}`
      );
      const product = await productResponse.json();
      await fetch(
        `https://pollo-y-pesto-nicolasmontone.vercel.app/api/supplies`,
        {
          method: 'POST',
          body: JSON.stringify({
            barcode: product.id,
            amount: 1,
          }),
        }
      );
      const suppliesResponse = await fetch(
        `https://pollo-y-pesto-nicolasmontone.vercel.app/api/supplies`
      );
      const newSupplies = await suppliesResponse.json();
      setSupplies(newSupplies);
      setScanning(false);
    } catch (error) {
      alert(error);
      setScanned(false);
    }
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  return (
    <SafeAreaView style={styles.container}>
      {scanning ? (
        <BarCodeScanner
          style={StyleSheet.absoluteFillObject}
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        />
      ) : (
        <View style={styles.supplies}>
          <Text style={styles.header}>Provisiones</Text>
          {supplies.map((supply) => (
            <View key={supply.id}>
              <Text style={styles.supplyText}>
                {supply.quantity} {supply.product_name} - hace{' '}
                {daysSince(supply.created_at)} días
              </Text>
            </View>
          ))}
          <Button
            title="Agregar producto"
            onPress={() => setScanning(true)}
          ></Button>
        </View>
      )}
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    color: '#fff',
    alignItems: 'center',
  },
  supplyText: {
    color: '#fff',
    fontSize: 16,
  },
  supplies: {
    width: '95%',
  },
  header: {
    color: '#fff',
    width: '100%',
    fontSize: 20,
    fontWeight: 'bold',
    paddingBottom: 10,
    paddingTop: 10,
  },
  supply: {
    flex: 1,
    flexDirection: 'column',
    width: 100,
  },
});

function daysSince(date: string) {
  return Math.floor(
    (new Date().getTime() - new Date(date).getTime()) / 86400000
  );
}
