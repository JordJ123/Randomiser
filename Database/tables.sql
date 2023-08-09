--------------------------------------------------------
--  File created - Wednesday-August-09-2023   
--------------------------------------------------------
--------------------------------------------------------
--  DDL for Table GAMES
--------------------------------------------------------

  CREATE TABLE "SYSTEM"."GAMES" 
   (	"ID" NUMBER(*,0), 
	"TITLE" VARCHAR2(255 BYTE), 
	"URL" VARCHAR2(255 BYTE)
   ) PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255 
 NOCOMPRESS LOGGING
  STORAGE(INITIAL 65536 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1
  BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
  TABLESPACE "SYSTEM" ;
--------------------------------------------------------
--  DDL for Table LOCATIONS
--------------------------------------------------------

  CREATE TABLE "SYSTEM"."LOCATIONS" 
   (	"ID" NUMBER(*,0), 
	"NAME" VARCHAR2(255 BYTE), 
	"X" FLOAT(126), 
	"Y" FLOAT(126), 
	"Z" FLOAT(126), 
	"IS_NAMED" NUMBER, 
	"GAME_ID" NUMBER
   ) PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255 
 NOCOMPRESS LOGGING
  STORAGE(INITIAL 65536 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1
  BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
  TABLESPACE "SYSTEM" ;
REM INSERTING into SYSTEM.GAMES
SET DEFINE OFF;
Insert into SYSTEM.GAMES (ID,TITLE,URL) values (1,'Call of Duty: Warzone 2.0','warzonetwo');
REM INSERTING into SYSTEM.LOCATIONS
SET DEFINE OFF;
Insert into SYSTEM.LOCATIONS (ID,NAME,X,Y,Z,IS_NAMED,GAME_ID) values (1,'Castle',null,null,null,1,1);
Insert into SYSTEM.LOCATIONS (ID,NAME,X,Y,Z,IS_NAMED,GAME_ID) values (2,'University',null,null,null,1,1);
Insert into SYSTEM.LOCATIONS (ID,NAME,X,Y,Z,IS_NAMED,GAME_ID) values (3,'City Hall',null,null,null,1,1);
Insert into SYSTEM.LOCATIONS (ID,NAME,X,Y,Z,IS_NAMED,GAME_ID) values (4,'Graveyard',null,null,null,1,1);
Insert into SYSTEM.LOCATIONS (ID,NAME,X,Y,Z,IS_NAMED,GAME_ID) values (5,'Mall',null,null,null,1,1);
Insert into SYSTEM.LOCATIONS (ID,NAME,X,Y,Z,IS_NAMED,GAME_ID) values (6,'Central Station',null,null,null,1,1);
Insert into SYSTEM.LOCATIONS (ID,NAME,X,Y,Z,IS_NAMED,GAME_ID) values (7,'Market',null,null,null,1,1);
Insert into SYSTEM.LOCATIONS (ID,NAME,X,Y,Z,IS_NAMED,GAME_ID) values (8,'Police Station',null,null,null,1,1);
Insert into SYSTEM.LOCATIONS (ID,NAME,X,Y,Z,IS_NAMED,GAME_ID) values (9,'Fire Department',null,null,null,1,1);
Insert into SYSTEM.LOCATIONS (ID,NAME,X,Y,Z,IS_NAMED,GAME_ID) values (10,'Museum',null,null,null,1,1);
Insert into SYSTEM.LOCATIONS (ID,NAME,X,Y,Z,IS_NAMED,GAME_ID) values (11,'Exhibt',null,null,null,1,1);
Insert into SYSTEM.LOCATIONS (ID,NAME,X,Y,Z,IS_NAMED,GAME_ID) values (12,'Floating District',null,null,null,1,1);
Insert into SYSTEM.LOCATIONS (ID,NAME,X,Y,Z,IS_NAMED,GAME_ID) values (13,'Zoo',null,null,null,1,1);
Insert into SYSTEM.LOCATIONS (ID,NAME,X,Y,Z,IS_NAMED,GAME_ID) values (14,'Stadium',null,null,null,1,1);
Insert into SYSTEM.LOCATIONS (ID,NAME,X,Y,Z,IS_NAMED,GAME_ID) values (15,'Cruise Terminal',null,null,null,1,1);
Insert into SYSTEM.LOCATIONS (ID,NAME,X,Y,Z,IS_NAMED,GAME_ID) values (16,'Souvenirs District',null,null,null,0,1);
Insert into SYSTEM.LOCATIONS (ID,NAME,X,Y,Z,IS_NAMED,GAME_ID) values (17,'Courtyard',null,null,null,0,1);
Insert into SYSTEM.LOCATIONS (ID,NAME,X,Y,Z,IS_NAMED,GAME_ID) values (18,'Kuvstenaar District',null,null,null,0,1);
--------------------------------------------------------
--  DDL for Index SYS_C008315
--------------------------------------------------------

  CREATE UNIQUE INDEX "SYSTEM"."SYS_C008315" ON "SYSTEM"."GAMES" ("ID") 
  PCTFREE 10 INITRANS 2 MAXTRANS 255 
  STORAGE(INITIAL 65536 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1
  BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
  TABLESPACE "SYSTEM" ;
--------------------------------------------------------
--  DDL for Index SYS_C008320
--------------------------------------------------------

  CREATE UNIQUE INDEX "SYSTEM"."SYS_C008320" ON "SYSTEM"."LOCATIONS" ("ID") 
  PCTFREE 10 INITRANS 2 MAXTRANS 255 
  STORAGE(INITIAL 65536 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1
  BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
  TABLESPACE "SYSTEM" ;
--------------------------------------------------------
--  DDL for Trigger GAMES_TRIGGER
--------------------------------------------------------

  CREATE OR REPLACE NONEDITIONABLE TRIGGER "SYSTEM"."GAMES_TRIGGER" 
BEFORE INSERT ON games
FOR EACH ROW
BEGIN
    SELECT games_autoincrement.NEXTVAL
    INTO :NEW.id
    FROM dual;
END;
/
ALTER TRIGGER "SYSTEM"."GAMES_TRIGGER" ENABLE;
--------------------------------------------------------
--  DDL for Trigger LOCATIONS_TRIGGER
--------------------------------------------------------

  CREATE OR REPLACE NONEDITIONABLE TRIGGER "SYSTEM"."LOCATIONS_TRIGGER" 
BEFORE INSERT ON locations
FOR EACH ROW
BEGIN
    SELECT locations_autoincrement.NEXTVAL
    INTO :NEW.id
    FROM dual;
END;
/
ALTER TRIGGER "SYSTEM"."LOCATIONS_TRIGGER" ENABLE;
--------------------------------------------------------
--  Constraints for Table GAMES
--------------------------------------------------------

  ALTER TABLE "SYSTEM"."GAMES" MODIFY ("TITLE" NOT NULL ENABLE);
  ALTER TABLE "SYSTEM"."GAMES" ADD PRIMARY KEY ("ID")
  USING INDEX PCTFREE 10 INITRANS 2 MAXTRANS 255 
  STORAGE(INITIAL 65536 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1
  BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
  TABLESPACE "SYSTEM"  ENABLE;
  ALTER TABLE "SYSTEM"."GAMES" MODIFY ("URL" NOT NULL ENABLE);
--------------------------------------------------------
--  Constraints for Table LOCATIONS
--------------------------------------------------------

  ALTER TABLE "SYSTEM"."LOCATIONS" MODIFY ("NAME" NOT NULL ENABLE);
  ALTER TABLE "SYSTEM"."LOCATIONS" ADD PRIMARY KEY ("ID")
  USING INDEX PCTFREE 10 INITRANS 2 MAXTRANS 255 
  STORAGE(INITIAL 65536 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1
  BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
  TABLESPACE "SYSTEM"  ENABLE;
  ALTER TABLE "SYSTEM"."LOCATIONS" MODIFY ("IS_NAMED" NOT NULL ENABLE);
  ALTER TABLE "SYSTEM"."LOCATIONS" MODIFY ("GAME_ID" NOT NULL ENABLE);
