package main

import (
	"encoding/json"
	"fmt"
	"time"

	// "strconv"
	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

type SmartContract struct {
	contractapi.Contract
}

type User struct {
	Id    int32
	Name  string
	Phone string
	Addr  string
}

type Bicycle struct {
	Owner      string `json:"Owner"` // temporarily set to string want to refer User sturct
	Company    string `json:"Company"`
	Model      string `json:"Model"`
	Colour     string `json:"Colour"`
	Image      string `json:"Image"`
	Comment    string `json:"Comment"`
	Location   string `json:"Location"`
	IsDeserted bool   `json:"IsDeserted"`
}

type RangedQueryResult struct {
	FromKey string `json:"fromKey"`
	ToKey   string `json:"toKey"`
	Record  *Bicycle
}

type HistoryQueryResult struct {
	Record    *Bicycle  `json:"record"`
	TxId      string    `json:"txId`
	Timestamp time.Time `json:"timestamp"`
	IsDelete  bool      `json:"isDelete`
}

/*
func (s *SmartContract) CreateTestData(ctx contractapi.TransactionContextInterface, key string) (*Bicycle, error) {
	assetAsBytes, err := ctx.GetStub().GetState(key)
	var TestData [5]Bicycle;
	for i < len(TestDate) {
		TestData[i++];
	}

	s.Set(ctx, key)
	if err != nil {
		return nil, fmt.Errorf("Failed to read from SimpleAsset world state. %s", err.Error())
	}

	if assetAsBytes == nil {
		return nil, fmt.Errorf("Asset Key %s does not exist", key)
	}

	asset := new(Bicycle)
	_ = json.Unmarshal(assetAsBytes, asset)

	return asset, nil
}*/

func (s *SmartContract) Get(ctx contractapi.TransactionContextInterface, bicycleId string) (*Bicycle, error) {
	assetAsBytes, err := ctx.GetStub().GetState(bicycleId)

	if err != nil {
		return nil, fmt.Errorf("failed to read from SimpleAsset world state. %s", err.Error())
	}

	if assetAsBytes == nil {
		return nil, fmt.Errorf("BicycleID %s does not exist", bicycleId)
	}

	asset := new(Bicycle)
	_ = json.Unmarshal(assetAsBytes, asset)

	return asset, nil
}

func (s *SmartContract) Set(ctx contractapi.TransactionContextInterface, key string, value string) error {
	fmt.Printf("Set Chaincode Executed")
	fmt.Print(key, value)
	parsedValue := Bicycle{}
	json.Unmarshal([]byte(value), &parsedValue)
	fmt.Println(parsedValue)

	asset := Bicycle{
		Owner:      "fakeUserId",
		Company:    parsedValue.Company,
		Model:      parsedValue.Model,
		Colour:     parsedValue.Colour,
		Image:      parsedValue.Image,
		Comment:    parsedValue.Comment,
		Location:   parsedValue.Location,
		IsDeserted: parsedValue.IsDeserted,
	}
	assetAsBytes, _ := json.Marshal(asset)
	fmt.Printf("Set Chaincode Exit with code 0")
	return ctx.GetStub().PutState(key, assetAsBytes)
}

/*
	1. History method
	2. Transfer method
	3. Main function

func (s *SmartContract) Transfer(ctx contractapi.TransactionContextInterface, from string, to string, amount float64) error {
	if amount <= 0 {
		return fmt.Errorf("Incorrect Transfering amount. Must be more than ZERO")
	}
	fromAsset, err := s.Get(ctx, from)
	if err != nil {
		return fmt.Errorf("Failed to get senders's state. %s", err.Error())
	}

	if fromAsset.Value < amount {
		return fmt.Errorf("insufficient money from sender")
	}

	toAsset, err := s.Get(ctx, to)
	if err != nil {
		return fmt.Errorf("Failed to get reciever's state. %s", err.Error())
	}

	fromAsset.Value -= amount
	toAsset.Value += amount
	fromAsBytes, _ := json.Marshal(fromAsset)
	toAsBytes, _ := json.Marshal(toAsset)

	ctx.GetStub().PutState(from, fromAsBytes)
	ctx.GetStub().PutState(to, toAsBytes)

	return nil
}

func (s *SmartContract) History(ctx contractapi.TransactionContextInterface, key string) ([]HistoryQueryResult, error) {
	log.Printf("Getting History For %s", key)

	resultsIterator, err := ctx.GetStub().GetHistoryForKey(key)

	if err != nil {
		return nil, err
	}
	defer resultsIterator.Close()

	var records []HistoryQueryResult
	for resultsIterator.HasNext() {
		response, err := resultsIterator.Next()
		if err != nil {
			return nil, err
		}

		var asset Bicycle
		if len(response.Value) > 0 {
			err = json.Unmarshal(response.Value, &asset)
			if err != nil {
				return nil, err
			}
		} else {
			asset = Bicycle{}
		}

		timestamp, err := ptypes.Timestamp(response.Timestamp)
		if err != nil {
			return nil, err
		}

		record := HistoryQueryResult{
			TxId:      response.TxId,
			Timestamp: timestamp,
			Record:    &asset,
			IsDelete:  response.IsDelete,
		}

		records = append(records, record)
	}
	return records, nil
}

func (s *SmartContract) GetKeyRange(ctx contractapi.TransactionContextInterface) ([]Bicycle, error) {
	var startKey string = ""
	var endKey string = ""

	resultsIterator, err := ctx.GetStub().GetStateByRange(startKey, endKey)

	if err != nil {
		return nil, err
	}
	defer resultsIterator.Close()

	results := []Bicycle{}

	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()

		if err != nil {
			return nil, err
		}
		//TODO : get query results
		asset := new(Bicycle)
		_ = json.Unmarshal(queryResponse.Value, asset)
		asset.Key = queryResponse.Key

		// queriedAsset := Asset {
		// 	Key: queryResponse.Key,
		// 	Value: strconv.ParseFloat(queryResponse.Value, 64),
		// }

		results = append(results, *asset)
	}
	return results, nil
}

*/
func main() {
	chaincode, err := contractapi.NewChaincode(new(SmartContract))

	if err != nil {
		fmt.Printf("Error create SimpleAsset chaincode: %s", err.Error())
	}

	if err := chaincode.Start(); err != nil {
		fmt.Printf("Error starting SimpleAsset chaincode: %s", err.Error())
	}
}
